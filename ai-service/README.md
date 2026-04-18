# Gurukul AI Microservice (Python)

FastAPI + Groq RAG service for the Gurukul Classes website.

## Setup

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## How it works

1. Receives a query from the Next.js app at `POST /api/ai-chat`
2. Fetches live data from MongoDB (faculty, events, toppers)
3. Builds a RAG system prompt with live context
4. Calls Groq API (`llama-3.1-8b-instant`)
5. Returns the answer

## Running both services

**Terminal 1 — Next.js:**
```bash
node server.js
```

**Terminal 2 — Python AI:**
```bash
cd ai-service
uvicorn main:app --port 8000 --reload
```

## Health check

```
GET http://localhost:8000/health
```
