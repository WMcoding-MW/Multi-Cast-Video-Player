import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We're using simple in-memory storage, but defining a schema
// to maintain consistency with the project structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// YouTube video schema
export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  publishedAt: z.string(),
  channelTitle: z.string(),
  viewCount: z.string().optional(),
});

export const searchResultSchema = z.object({
  items: z.array(
    z.object({
      id: z.object({
        videoId: z.string(),
      }),
      snippet: z.object({
        title: z.string(),
        thumbnails: z.object({
          high: z.object({
            url: z.string(),
          }),
        }),
        publishedAt: z.string(),
        channelTitle: z.string(),
      }),
    })
  ),
});

export type Video = z.infer<typeof videoSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
