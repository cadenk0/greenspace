/**
 * routes.ts
 *
 * Handles some routes for the server.
 */
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { ai } from "./replit_integrations/image/client";

const upload = multer({ storage: multer.memoryStorage() });

function isGreenActivityVerified(points: number): boolean {
  return points >= 5;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  setupAuth(app);

  app.get(api.leaderboard.list.path, async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  app.get(api.activities.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const activities = await storage.getUserActivities(req.user!.id);
    res.json(activities);
  });

  app.post(
    api.activities.create.path,
    upload.single("image"),
    async (req, res) => {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      try {
        const caption = req.body.caption || "";
        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        // Analyze with Gemini
        const prompt = `
        Analyze this image. Does it show a specific, verifiable green/eco-friendly activity being performed? 
        If yes, describe it briefly and award a point score between 10 and 50 based on impact and effort.
        If no (or if it's just a generic nature photo without action), score 5.
        
        Return valid JSON only:
        { "isGreen": boolean, "description": string, "points": number }
      `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: base64Image } },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        const responseText =
          response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("Failed to get analysis from AI");

        const analysis = JSON.parse(responseText);

        const verified = isGreenActivityVerified(analysis.points || 0);

        const activity = await storage.createActivity({
          userId: req.user!.id,
          imageUrl: `data:${mimeType};base64,${base64Image}`,
          caption,
          points: analysis.points || 0,
          verified, // ← new field
        });

        if (verified) {
          await storage.incrementGreenScore(req.user!.id, analysis.points);
        }

        if (analysis.points > 0) {
          await storage.incrementGreenScore(req.user!.id, analysis.points);
        }

        res.status(201).json(activity);
      } catch (error) {
        console.error("Activity upload error:", error);
        res.status(500).json({ message: "Failed to process activity" });
      }
    },
  );

  return httpServer;
}
