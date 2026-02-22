import { z } from 'zod';
import { channels, movies, series, episodes, insertChannelSchema, insertMovieSchema, insertSeriesSchema, insertEpisodeSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels' as const,
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof channels.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/channels/:id' as const,
      responses: {
        200: z.custom<typeof channels.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  movies: {
    list: {
      method: 'GET' as const,
      path: '/api/movies' as const,
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof movies.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/movies/:id' as const,
      responses: {
        200: z.custom<typeof movies.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  series: {
    list: {
      method: 'GET' as const,
      path: '/api/series' as const,
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof series.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/series/:id' as const,
      responses: {
        200: z.custom<typeof series.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    episodes: {
      method: 'GET' as const,
      path: '/api/series/:id/episodes' as const,
      responses: {
        200: z.array(z.custom<typeof episodes.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
