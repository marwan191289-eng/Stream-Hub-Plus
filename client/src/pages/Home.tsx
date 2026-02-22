import { useChannels, useMovies, useSeriesList } from "@/hooks/use-media";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { MediaRow } from "@/components/ui/MediaRow";
import { Loader2 } from "lucide-react";

export function Home() {
  const { data: movies, isLoading: loadingMovies } = useMovies();
  const { data: series, isLoading: loadingSeries } = useSeriesList();
  const { data: channels, isLoading: loadingChannels } = useChannels();

  const isLoading = loadingMovies || loadingSeries || loadingChannels;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Get featured movie for hero
  const featuredMovie = movies?.[0] || {
    title: "Featured Content",
    description: "Discover amazing movies, series, and live TV channels on StreamHub.",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&h=1080&fit=crop",
    videoUrl: "#"
  };

  const movieItems = movies?.map(m => ({
    id: m.id,
    title: m.title,
    posterUrl: m.posterUrl || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop",
    playUrl: `/play/movie/${m.id}`,
    badge: m.year?.toString()
  })) || [];

  const seriesItems = series?.map(s => ({
    id: s.id,
    title: s.title,
    posterUrl: s.posterUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&h=750&fit=crop",
    playUrl: `/series/${s.id}`,
    badge: s.year?.toString()
  })) || [];

  const channelItems = channels?.map(c => ({
    id: c.id,
    title: c.name,
    posterUrl: c.logo || "https://images.unsplash.com/photo-1518930034639-6e3e551a37c9?w=500&h=375&fit=crop",
    playUrl: `/play/channel/${c.id}`,
    badge: "LIVE"
  })) || [];

  return (
    <div className="min-h-screen pb-20">
      <HeroBanner
        title={featuredMovie.title}
        description={featuredMovie.description || "An incredible journey awaits."}
        posterUrl={featuredMovie.posterUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&h=1080&fit=crop"}
        playUrl={`/play/movie/${featuredMovie.id}`}
        tag="TRENDING NOW"
      />
      
      <div className="relative z-20 -mt-32 pb-12 space-y-8">
        <MediaRow title="Live TV Channels" items={channelItems} isChannel />
        <MediaRow title="Trending Movies" items={movieItems} />
        <MediaRow title="Binge-Worthy Series" items={seriesItems} />
      </div>
    </div>
  );
}
