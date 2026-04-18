import Groq from "groq-sdk";
import { connectDB } from "@/lib/db/mongodb";
import { Faculty } from "@/lib/db/models/Faculty";
import { Event } from "@/lib/db/models/Event";
import { Topper } from "@/lib/db/models/Topper";

// Create Groq client fresh each call in dev, cached in prod
let _groq: Groq | null = null;
function getGroq(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set in environment variables");
  // Always create fresh to avoid stale key from hot reloads
  if (!_groq || process.env.NODE_ENV === "development") {
    _groq = new Groq({ apiKey: key });
  }
  return _groq;
}

const STATIC_FACTS = `
- Offline tuition for Grade 1–12 (Gujarat Board / NCERT)
- Specialized JEE (Engineering) and NEET (Medical) coaching
- Admissions: Fill the inquiry form on the website
- Contact: Gurukulclasses001@gmail.com
- Phone: +91 88490 35591
- Social: Instagram (@edukulam_), Facebook (GurukulClassesAhmedabad)
- Location: Ghodasar, Ahmedabad, Gujarat, India
- Established: 2011
`;

const FALLBACK_RESPONSE =
  "Our AI assistant is temporarily unavailable. Please contact us at Gurukulclasses001@gmail.com or call +91 88490 35591.";

async function fetchRAGContext(): Promise<string> {
  await connectDB();

  const [facultyResult, eventsResult, toppersResult] = await Promise.allSettled([
    Faculty.find({}).sort({ created_at: -1 }).limit(20).lean(),
    Event.find({}).sort({ created_at: -1 }).limit(10).lean(),
    Topper.find({}).sort({ created_at: -1 }).limit(10).lean(),
  ]);

  const facultyLines =
    facultyResult.status === "fulfilled" && facultyResult.value.length > 0
      ? (facultyResult.value as any[])
          .map((f) => `  - ${f.name} — ${f.role}, ${f.expertise}`)
          .join("\n")
      : "  - Faculty details available on request";

  const eventLines =
    eventsResult.status === "fulfilled" && eventsResult.value.length > 0
      ? (eventsResult.value as any[])
          .map((e) => `  - ${e.title} on ${e.date} at ${e.location || "Main Campus"} (${e.category})`)
          .join("\n")
      : "  - No upcoming events currently";

  const topperLines =
    toppersResult.status === "fulfilled" && toppersResult.value.length > 0
      ? (toppersResult.value as any[])
          .slice(0, 5)
          .map((t) => `  - ${t.name} — ${t.score} in ${t.exam} (${t.year})`)
          .join("\n")
      : "  - Topper details available on website";

  return `Faculty:\n${facultyLines}\n\nUpcoming Events:\n${eventLines}\n\nRecent Toppers:\n${topperLines}`;
}

function buildSystemPrompt(liveContext: string): string {
  return `You are the official AI assistant for Gurukul Classes, an offline coaching institute in Ahmedabad, Gujarat, India.

LIVE INSTITUTE DATA (updated in real-time):
${liveContext}

STATIC FACTS:
${STATIC_FACTS}

RULES:
- Only answer questions about Gurukul Classes: admissions, courses, faculty, events, fees, timings, location, and contact.
- If asked anything outside this scope, say: "I can only assist with questions about Gurukul Classes. Please contact us at Gurukulclasses001@gmail.com."
- Answer in 2-3 clear sentences. Be helpful and friendly.
- Never invent information not present above.`;
}

export async function getAIResponse(query: string): Promise<string> {
  const envKey = process.env.GROQ_API_KEY;
  if (!envKey) {
    console.error("[AI] GROQ_API_KEY missing from environment");
    return FALLBACK_RESPONSE;
  }

  let systemPrompt: string;
  try {
    const liveContext = await fetchRAGContext();
    systemPrompt = buildSystemPrompt(liveContext);
  } catch (err) {
    console.error("[RAG] Context fetch failed, using static fallback:", err);
    systemPrompt = buildSystemPrompt(
      "Faculty:\n  - Details available on website\n\nUpcoming Events:\n  - Check website for events\n\nRecent Toppers:\n  - See toppers section on website"
    );
  }

  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    return answer || "Sorry, I could not generate a response. Please contact the office directly.";
  } catch (err: any) {
    console.error("[Groq] API call failed:", err?.status, err?.message || err);
    return FALLBACK_RESPONSE;
  }
}
