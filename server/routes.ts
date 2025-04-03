import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { z } from "zod";
import { searchResultSchema } from "@shared/schema";

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  throw new Error("YOUTUBE_API_KEY environment variable is not set");
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Search YouTube API endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { league, query } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ 
          message: "Query parameter is required" 
        });
      }
      
      // Build a more targeted search query
      let searchQuery = "";
      const leagueStr = typeof league === "string" ? league.trim() : "";
      const queryStr = typeof query === "string" ? query.trim() : "";
      
      // Create league-specific search strategies
      if (leagueStr.toLowerCase() === "nhl" || leagueStr.toLowerCase().includes("hockey")) {
        // NHL/hockey-specific search optimization
        searchQuery = `${leagueStr} ${queryStr} hockey highlights goals`;
      } else if (leagueStr.toLowerCase() === "nba" || leagueStr.toLowerCase().includes("basketball")) {
        // NBA/basketball-specific search
        searchQuery = `${leagueStr} ${queryStr} basketball highlights dunks`;
      } else if (leagueStr.toLowerCase() === "nfl" || leagueStr.toLowerCase().includes("football")) {
        // NFL/football-specific search
        searchQuery = `${leagueStr} ${queryStr} football highlights touchdowns`;
      } else if (leagueStr.toLowerCase() === "mlb" || leagueStr.toLowerCase().includes("baseball")) {
        // MLB/baseball-specific search
        searchQuery = `${leagueStr} ${queryStr} baseball highlights home runs`;
      } else {
        // Generic sports search
        searchQuery = `${leagueStr} ${queryStr} sports highlights recent`;
      }
      
      const encodedQuery = encodeURIComponent(searchQuery);
      
      // Set date range for recent highlights (past 3 months to get more relevant results)
      const publishedAfter = new Date();
      publishedAfter.setMonth(publishedAfter.getMonth() - 3);
      
      // YouTube API URL - increased maxResults to 10 to allow for filtering
      // Changed order to relevance for better topical matches
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodedQuery}&type=video&videoEmbeddable=true&key=${API_KEY}&order=relevance&relevanceLanguage=en&videoDuration=short&publishedAfter=${publishedAfter.toISOString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          message: `YouTube API error: ${errorText}` 
        });
      }
      
      const data = await response.json();
      const validatedData = searchResultSchema.parse(data);
      
      // Transform the data to our format
      const transformedVideos = validatedData.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      }));
      
      res.json(transformedVideos);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      if (error instanceof z.ZodError) {
        return res.status(500).json({ 
          message: "Invalid response from YouTube API",
          details: error.errors 
        });
      }
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
