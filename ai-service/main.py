"""
Gurukul Classes — Python AI Microservice
FastAPI + Groq (llama-3.1-8b-instant) + RAG from MongoDB
Run: uvicorn main:app --host 0.0.0.0 --port 8000
"""

import os
import asyncio
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env.local"), override=True)

app = FastAPI(title="Gurukul AI Service")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    os.getenv("NEXTAUTH_URL", "http://localhost:3000"),
    os.getenv("VERCEL_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# ─── Config ──────────────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URI  = os.getenv("MONGODB_URI")
RENDER_URL   = os.getenv("RENDER_EXTERNAL_URL", "")

print(f"[Config] GROQ_API_KEY: {'SET' if GROQ_API_KEY else 'MISSING'}")
print(f"[Config] MONGODB_URI: {'SET' if MONGODB_URI else 'MISSING'}")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not set")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI not set")

groq_client = Groq(api_key=GROQ_API_KEY)

_db = None

def get_db():
    global _db
    if _db is None:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        _db = client.get_default_database()
    return _db

# ─── Keep-alive ping (prevents Render free tier sleep) ───────────────────────
async def keep_alive():
    await asyncio.sleep(60)  # wait 1 min after startup
    while True:
        try:
            if RENDER_URL:
                async with httpx.AsyncClient() as client:
                    await client.get(f"{RENDER_URL}/health", timeout=10)
                    print("[Keep-alive] Pinged self")
        except Exception as e:
            print(f"[Keep-alive] Failed: {e}")
        await asyncio.sleep(14 * 60)  # every 14 minutes

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(keep_alive())

# ─── RAG Context ─────────────────────────────────────────────────────────────
STATIC_FACTS = """
- Offline tuition for Grade 1–12 (Gujarat Board / NCERT)
- Specialized JEE (Engineering) and NEET (Medical) coaching
- Admissions: Fill the inquiry form on the website
- Contact: Gurukulclasses001@gmail.com | Phone: +91 88490 35591
- Instagram: @edukulam_ | Facebook: GurukulClassesAhmedabad
- Location: Ghodasar, Ahmedabad, Gujarat, India | Est. 2011
"""

def fetch_rag_context() -> str:
    try:
        db = get_db()
        faculty = list(db.faculties.find({}, {"name": 1, "role": 1, "expertise": 1}).limit(15))
        events  = list(db.events.find({}, {"title": 1, "date": 1, "location": 1, "category": 1}).limit(8))
        toppers = list(db.toppers.find({}, {"name": 1, "score": 1, "exam": 1, "year": 1}).limit(5))

        f = "\n".join(f"  - {x.get('name')} — {x.get('role')}, {x.get('expertise')}" for x in faculty) or "  - See website"
        e = "\n".join(f"  - {x.get('title')} on {x.get('date')} at {x.get('location','Main Campus')}" for x in events) or "  - Check website"
        t = "\n".join(f"  - {x.get('name')} — {x.get('score')} in {x.get('exam')} ({x.get('year')})" for x in toppers) or "  - See website"

        return f"Faculty:\n{f}\n\nEvents:\n{e}\n\nToppers:\n{t}"
    except Exception as ex:
        print(f"[RAG] MongoDB error: {ex}")
        return ""

def build_system_prompt(ctx: str) -> str:
    return f"""You are the official AI assistant for Gurukul Classes, an offline coaching institute in Ahmedabad, Gujarat, India.

LIVE DATA:
{ctx}

FACTS:
{STATIC_FACTS}

RULES:
- Only answer about Gurukul Classes (admissions, courses, faculty, events, location, contact).
- For anything else say: "I can only assist with Gurukul Classes questions. Contact us at Gurukulclasses001@gmail.com."
- Answer in 2-3 clear sentences. Never invent information."""

# ─── Models ───────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    success: bool
    answer: str

FALLBACK = "Our AI assistant is temporarily unavailable. Please contact us at Gurukulclasses001@gmail.com or call +91 88490 35591."

# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.post("/api/ai-chat", response_model=QueryResponse)
async def ai_chat(req: QueryRequest):
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    ctx = fetch_rag_context()
    system_prompt = build_system_prompt(ctx)

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": query},
            ],
            max_tokens=300,
            temperature=0.5,
        )
        answer = completion.choices[0].message.content.strip()
        return QueryResponse(success=True, answer=answer or FALLBACK)
    except Exception as ex:
        print(f"[Groq] Error: {ex}")
        return QueryResponse(success=False, answer=FALLBACK)

@app.get("/health")
async def health():
    return {"status": "ok", "groq": bool(GROQ_API_KEY)}
