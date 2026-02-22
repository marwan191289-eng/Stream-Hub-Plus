import { useQuery } from "@tanstack/react-query";
import { type Channel, type Movie, type Series, type Episode } from "@shared/schema";

// Helper for making API calls
async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "include" });
  if (!res.ok) {
    if (res.status === 404) return null as T;
    throw new Error(`Failed to fetch ${path}`);
  }
  return res.json();
}

export function useChannels(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  const query = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: ["/api/channels", search, category],
    queryFn: () => fetchApi<Channel[]>(`/api/channels${query}`),
  });
}

export function useChannel(id: number) {
  return useQuery({
    queryKey: [`/api/channels/${id}`],
    queryFn: () => fetchApi<Channel>(`/api/channels/${id}`),
    enabled: !!id,
  });
}

export function useMovies(search?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: ["/api/movies", search],
    queryFn: () => fetchApi<Movie[]>(`/api/movies${query}`),
  });
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: [`/api/movies/${id}`],
    queryFn: () => fetchApi<Movie>(`/api/movies/${id}`),
    enabled: !!id,
  });
}

export function useSeriesList(search?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: ["/api/series", search],
    queryFn: () => fetchApi<Series[]>(`/api/series${query}`),
  });
}

export function useSeries(id: number) {
  return useQuery({
    queryKey: [`/api/series/${id}`],
    queryFn: () => fetchApi<Series>(`/api/series/${id}`),
    enabled: !!id,
  });
}

export function useEpisodes(seriesId: number) {
  return useQuery({
    queryKey: [`/api/series/${seriesId}/episodes`],
    queryFn: () => fetchApi<Episode[]>(`/api/series/${seriesId}/episodes`),
    enabled: !!seriesId,
  });
}
