import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Route 1: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Platinum Production Package AI Cover Song Accelerator" });
  });

  // API Route 2: Generate lyrics using server-side Gemini
  app.post("/api/gemini/generate-lyrics", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in server environment."
        });
      }

      const {
        genre,
        mood,
        bpm,
        flowStyle,
        songStructure,
        rhymeDensity,
        beatDescription,
        topic,
        artistVibe
      } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const prompt = `
You are a Grammy-winning audio engineer and hitmaker song producer behind the Platinum Production Package at tjbpro.ai.
Generate hit song lyrics for an AI Cover Song Accelerator project with exact vocal cadence formatting and section headings.

Song Specifications:
- Genre / Style: ${genre || "Melodic Trap / Southern Rap"}
- Mood / Vibe: ${mood || "Energetic / Dark"}
- Tempo: ${bpm || "120 BPM"}
- Vocal Flow Style: ${flowStyle || "Melodic Rap-Singing"}
- Song Structure: ${songStructure || "Verse - Chorus - Verse - Chorus - Outro"}
- Rhyme Density & Cadence: ${rhymeDensity || "Heavy Multi-Syllabic"}
- Beat Description / Sonic Textures: ${beatDescription || "808 sub-bass, atmospheric synths, crisp snare"}
- Topic / Concept: ${topic || "Hustle, triumph, elevated sound, platinum success"}
${artistVibe ? `- Artist Inspiration: ${artistVibe}` : ""}

Formatting Requirements:
1. Structure each section with clear bracketed headers, e.g., [INTRO], [VERSE 1], [CHORUS], [VERSE 2], [CHORUS], [OUTRO].
2. Include vocal cues in parentheses, e.g. (Ad-lib: Yeah, yeah!), (Stack vocal), or (Double speed chopper flow).
3. Ensure line syllable count matches the requested tempo and cadence (${flowStyle}).
4. Add a short section at the top called "VOCAL DELIVERY GUIDE & CADENCE NOTES" explaining how the vocalist should execute the flow over this specific beat tempo.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      const lyricsText = response.text || "Failed to generate lyrics.";

      res.json({
        success: true,
        lyrics: lyricsText
      });
    } catch (err: any) {
      console.error("Error in /api/gemini/generate-lyrics:", err);
      res.status(500).json({
        error: err.message || "Failed to process lyric generation."
      });
    }
  });

  // API Route 3: Submit Platinum Mix Token
  app.post("/api/redeem-token", (req, res) => {
    try {
      const { userName, userEmail, songTitle, stemsUrl, notes } = req.body;

      if (!userName || !userEmail || !songTitle || !stemsUrl) {
        return res.status(400).json({
          error: "All required fields (Name, Email, Song Title, Stems URL) must be provided."
        });
      }

      // Generate confirmation code
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const tokenId = `PLAT-MIX-${new Date().getFullYear()}-${randomCode}`;

      const submission = {
        tokenId,
        userName,
        userEmail,
        songTitle,
        stemsUrl,
        notes: notes || "",
        submittedAt: new Date().toISOString(),
        status: "QUEUED_FOR_MIXING",
        estimatedTurnaround: "24 - 48 Hours"
      };

      res.json({
        success: true,
        message: "Platinum Mix Token successfully redeemed!",
        submission
      });
    } catch (err: any) {
      console.error("Error in /api/redeem-token:", err);
      res.status(500).json({ error: "Failed to submit token redemption." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
