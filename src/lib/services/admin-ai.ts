/**
 * Content Architect Service (Admin AI Generator)
 * This is a lightweight wrapper that calls the specialized Python AI microservice
 * to generate structured educational notes and image prompts.
 */

export interface AdminAIResponse {
  markdown: string;
  image_prompts: string[];
}

export async function generateAdminNote(prompt: string): Promise<AdminAIResponse> {
  const serviceUrl = process.env.PYTHON_AI_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${serviceUrl}/api/admin-note-generator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(`AI Service Error: ${res.status}`);

    const data = await res.json();
    
    if (data.success) {
      return {
        markdown: data.markdown,
        image_prompts: data.image_prompts || [],
      };
    }

    return { markdown: "Failed to generate notes via AI service.", image_prompts: [] };
  } catch (err) {
    console.error("[Admin AI Client] Error fetching generator:", err);
    return { markdown: "Error connecting to AI service.", image_prompts: [] };
  }
}
