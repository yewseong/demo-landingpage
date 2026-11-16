import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.post("/api/ai-grant-chat", async (req, res) => {
  try {
    const { messages, companyDetails } = req.body;
    
    const systemInstruction = `You are Apex AI, an elite government grant strategist and non-dilutive capital advisor for high-growth companies. You help founders analyze their technology, research, or product roadmap to identify matching federal and state grant opportunities (SBIR/STTR, Horizon, Innovate UK, Defense/Dual-Use, etc.), evaluate win probabilities, and draft compelling executive summaries. Be concise, highly professional, authoritative, and structured in Apple's crisp, elegant advisory tone.`;

    const userPrompt = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : "Hello, analyze my company for grants.";

    const companyContext = companyDetails 
      ? `\n\nCompany Context:\nName: ${companyDetails.name || 'Unnamed'}\nSector: ${companyDetails.sector || 'Tech'}\nStage: ${companyDetails.stage || 'Seed'}\nGoal: ${companyDetails.goal || 'R&D Funding'}`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `${systemInstruction}\n${companyContext}\n\nUser Question: ${userPrompt}`,
    });

    res.json({ reply: response.text || "No response generated." });
  } catch (error: any) {
    console.error("AI Grant Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
