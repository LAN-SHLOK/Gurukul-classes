/**
 * Gurukul Mentor Service (Academic AI Assistant)
 * This is a lightweight wrapper that calls the specialized Python AI microservice
 * deployed on Render.
 */

const FALLBACK_RESPONSE = "Our AI assistant is temporarily unavailable. Please contact us at Gurukulclasses001@gmail.com.";

export async function getAIResponse(query: string): Promise<string> {
  const serviceUrl = process.env.PYTHON_AI_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${serviceUrl}/api/academic-mentor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`AI Service Error: ${res.status}`);

    const data = await res.json();
    return data.success ? data.answer : FALLBACK_RESPONSE;
  } catch (err) {
    console.error("[AI Client] Error fetching response:", err);
    return FALLBACK_RESPONSE;
  }
}
