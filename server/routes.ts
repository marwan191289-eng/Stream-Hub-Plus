import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Channels
  app.get(api.channels.list.path, async (req, res) => {
    const search = req.query.search as string;
    const items = await storage.getChannels(search);
    res.json(items);
  });

  app.get(api.channels.get.path, async (req, res) => {
    const item = await storage.getChannel(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Channel not found" });
    res.json(item);
  });

  // Movies
  app.get(api.movies.list.path, async (req, res) => {
    const search = req.query.search as string;
    const items = await storage.getMovies(search);
    res.json(items);
  });

  app.get(api.movies.get.path, async (req, res) => {
    const item = await storage.getMovie(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Movie not found" });
    res.json(item);
  });

  // Series
  app.get(api.series.list.path, async (req, res) => {
    const search = req.query.search as string;
    const items = await storage.getSeriesList(search);
    res.json(items);
  });

  app.get(api.series.get.path, async (req, res) => {
    const item = await storage.getSeries(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Series not found" });
    res.json(item);
  });

  app.get(api.series.episodes.path, async (req, res) => {
    const items = await storage.getEpisodes(Number(req.params.id));
    res.json(items);
  });
  
  // Proxy endpoint to bypass CORS and regional restrictions
  app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ message: "Missing url parameter" });
    }
    
    try {
      const fetchResponse = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': '*/*',
          'Connection': 'keep-alive',
          'Referer': targetUrl,
        }
      });
      
      const contentType = fetchResponse.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      
      // Essential for IPTV streams
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      
      if (fetchResponse.body) {
        // @ts-ignore
        const nodeStream = (await import('node:stream')).Readable.from(fetchResponse.body);
        nodeStream.pipe(res);
      } else {
        res.status(404).end();
      }
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).json({ message: "Error proxying request" });
    }
  });

  // @ts-ignore
  const { syncIptvData } = await import('./iptv');
  syncIptvData().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingMovies = await storage.getMovies();
  if (existingMovies.length === 0) {
    // Seed Movies
    await storage.createMovie({
      title: "Big Buck Bunny",
      description: "A large and lovable rabbit deals with three bullying rodents.",
      videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/640px-Big_buck_bunny_poster_big.jpg",
      year: 2008,
      rating: "PG"
    });
    
    await storage.createMovie({
      title: "Elephants Dream",
      description: "Two characters explore a strange, surreal, mechanical world.",
      videoUrl: "http://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.m3u8",
      posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/640px-Elephants_Dream_s5_both.jpg",
      year: 2006,
      rating: "PG"
    });

    // Seed Series
    const series1 = await storage.createSeries({
      title: "Open Source Tales",
      description: "A collection of the best open source animated films.",
      posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sintel_poster.jpg/640px-Sintel_poster.jpg",
      year: 2010
    });

    await storage.createEpisode({
      seriesId: series1.id,
      season: 1,
      episode: 1,
      title: "Sintel",
      videoUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    });

    await storage.createEpisode({
      seriesId: series1.id,
      season: 1,
      episode: 2,
      title: "Tears of Steel",
      videoUrl: "http://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.m3u8"
    });

    // Seed Channels
    await storage.createChannel({
      name: "Red Bull TV",
      url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
      category: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Red_Bull_logo.svg/1200px-Red_Bull_logo.svg.png",
      country: "Global"
    });

    await storage.createChannel({
      name: "NASA TV",
      url: "https://nasa-i.akamaihd.net/hls/live/253565/NTV-Public1/master.m3u8",
      category: "Science",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1200px-NASA_logo.svg.png",
      country: "USA"
    });
    
    await storage.createChannel({
      name: "Bloomberg TV",
      url: "https://live.bloomberg.tv/hls/live/2012028/bloombergtv_us/master.m3u8",
      category: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bloomberg_Television_logo.svg/1200px-Bloomberg_Television_logo.svg.png",
      country: "USA"
    });
  }
}
