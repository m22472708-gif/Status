import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Shobdanjoli API is running" });
  });

  // Use Groq API
  app.post("/api/generate-caption", async (req, res) => {
    console.log("Received generation request:", req.body);
    try {
      const { category, vibe, length, prompt, count = 1 } = req.body;
      let apiKey = process.env.GROQ_API_KEY;
      
      // Fallback key if not in env
      if (!apiKey || apiKey.trim() === "") {
        apiKey = "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";
      }

      const groq = new Groq({ apiKey });

      let lengthInstruction = "Keep it very short and punchy (max 10-12 words).";
      if (length === "medium") lengthInstruction = "Keep it moderate (20-30 words).";
      if (length === "long") lengthInstruction = "Make it deep, poetic and detailed (50+ words).";

      const systemPrompt = `You are an expert Bengali creative writer. 
Generate exactly ${count} unique, high-quality social media status(es) in Bengali.
Category: ${category}
Vibe: ${vibe}
Length: ${lengthInstruction}

Rules:
1. Language: Elegant Bengali (Cholitobhasha).
2. Poetic: Use metaphors and emotional depth.
3. Emojis: End each status with 1-2 simple, relevant emojis.
4. JSON ONLY: Return ONLY a JSON object: {"captions": ["status 1", "status 2", ...]}. No text before or after.
`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt ? `Topic Context: ${prompt}` : "Generate beautiful Bengali statuses." }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content || '{"captions": []}';
      
      // Clean up potential markdown blocks if present
      const cleanedContent = content.replace(/```json\n?|```/g, '').trim();
      
      try {
        const result = JSON.parse(cleanedContent);
        res.json(result);
      } catch (parseError) {
        console.error("Failed to parse JSON from model:", content);
        res.status(500).json({ error: "Model returned invalid format. Please try again." });
      }
    } catch (error: any) {
      console.error("Error generating caption with Groq:", error);
      res.status(500).json({ error: error.message || "Failed to generate caption" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL: Failed to start server:", err);
  process.exit(1);
});
