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
  const serviceUrl = process.env.PYTHON_AI_URL;
  
  if (!serviceUrl) {
    console.error("[Admin AI] PYTHON_AI_URL is not set in environment variables.");
    return { markdown: "AI Service URL not configured. Please check Vercel environment variables.", image_prompts: [] };
  }

  // Ensure no trailing slash and correct path
  const targetUrl = `${serviceUrl.replace(/\/$/, "")}/api/admin-note-generator`;

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      // Give Render extra time to wake up if it's sleeping
      signal: AbortSignal.timeout(55000), 
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Service Error (${res.status}): ${errorText.substring(0, 100)}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return {
        markdown: data.markdown,
        image_prompts: data.image_prompts || [],
      };
    }

    return { markdown: data.markdown || "Failed to generate notes via AI service.", image_prompts: [] };
  } catch (err: any) {
    console.error("[Admin AI Client] Connection failed:", err.message);
    return { 
      markdown: `Connection failed: ${err.message}. (Tip: If Render is sleeping, it may take 1 minute to wake up).`, 
      image_prompts: [] 
    };
  }
}
