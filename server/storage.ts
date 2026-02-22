import { db } from "./db";
import {
  channels, movies, series, episodes,
  type Channel, type Movie, type Series, type Episode,
  type InsertChannel, type InsertMovie, type InsertSeries, type InsertEpisode
} from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

export interface IStorage {
  getChannels(search?: string, category?: string): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;

  getMovies(search?: string): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;

  getSeriesList(search?: string): Promise<Series[]>;
  getSeries(id: number): Promise<Series | undefined>;
  createSeries(s: InsertSeries): Promise<Series>;

  getEpisodes(seriesId: number): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
}

export class DatabaseStorage implements IStorage {
  async getChannels(search?: string, category?: string): Promise<Channel[]> {
    let query = db.select().from(channels);
    if (search) {
      query = query.where(ilike(channels.name, `%${search}%`)) as any;
    }
    return await query;
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [c] = await db.select().from(channels).where(eq(channels.id, id));
    return c;
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const [c] = await db.insert(channels).values(channel).returning();
    return c;
  }

  async getMovies(search?: string): Promise<Movie[]> {
    let query = db.select().from(movies);
    if (search) {
      query = query.where(ilike(movies.title, `%${search}%`)) as any;
    }
    return await query;
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [m] = await db.select().from(movies).where(eq(movies.id, id));
    return m;
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const [m] = await db.insert(movies).values(movie).returning();
    return m;
  }

  async getSeriesList(search?: string): Promise<Series[]> {
    let query = db.select().from(series);
    if (search) {
      query = query.where(ilike(series.title, `%${search}%`)) as any;
    }
    return await query;
  }

  async getSeries(id: number): Promise<Series | undefined> {
    const [s] = await db.select().from(series).where(eq(series.id, id));
    return s;
  }

  async createSeries(s: InsertSeries): Promise<Series> {
    const [res] = await db.insert(series).values(s).returning();
    return res;
  }

  async getEpisodes(seriesId: number): Promise<Episode[]> {
    return await db.select().from(episodes).where(eq(episodes.seriesId, seriesId));
  }

  async createEpisode(episode: InsertEpisode): Promise<Episode> {
    const [e] = await db.insert(episodes).values(episode).returning();
    return e;
  }
}

export const storage = new DatabaseStorage();
