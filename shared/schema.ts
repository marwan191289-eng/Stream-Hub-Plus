import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  logo: text("logo"),
  country: text("country"),
  extId: text("ext_id"), // External ID from IPTV provider
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  posterUrl: text("poster_url"),
  year: integer("year"),
  rating: text("rating"),
  category: text("category"),
  extId: text("ext_id"),
});

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  posterUrl: text("poster_url"),
  year: integer("year"),
  category: text("category"),
  extId: text("ext_id"),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").notNull(),
  season: integer("season").notNull(),
  episode: integer("episode").notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  extId: text("ext_id"),
});

export const insertChannelSchema = createInsertSchema(channels).omit({ id: true });
export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });
export const insertSeriesSchema = createInsertSchema(series).omit({ id: true });
export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true });

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Series = typeof series.$inferSelect;
export type InsertSeries = z.infer<typeof insertSeriesSchema>;

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
