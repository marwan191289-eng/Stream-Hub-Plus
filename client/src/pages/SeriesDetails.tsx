import { useRoute } from "wouter";
import { useSeries, useEpisodes } from "@/hooks/use-media";
import { Loader2, Play, Calendar, ListVideo } from "lucide-react";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { Link } from "wouter";

export function SeriesDetails() {
  const [, params] = useRoute("/series/:id");
  const id = parseInt(params?.id || "0", 10);
  
  const { data: series, isLoading: loadingSeries } = useSeries(id);
  const { data: episodes, isLoading: loadingEpisodes } = useEpisodes(id);

  if (loadingSeries || loadingEpisodes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white text-2xl font-bold">
        Series not found
      </div>
    );
  }

  const firstEpisode = episodes?.[0];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <HeroBanner
        title={series.title}
        description={series.description}
        posterUrl={series.posterUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1920&h=1080&fit=crop"}
        playUrl={firstEpisode ? `/play/episode/${firstEpisode.id}` : "#"}
        tag={series.year?.toString()}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 -mt-20 relative z-20">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <ListVideo className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">Episodes</h2>
          </div>

          {!episodes?.length ? (
            <p className="text-zinc-400 text-lg py-8 text-center bg-black/20 rounded-xl">
              No episodes available yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {episodes.map((ep, idx) => (
                <Link
                  key={ep.id}
                  href={`/play/episode/${ep.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="relative w-full sm:w-48 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={series.posterUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&h=280&fit=crop"} 
                      alt={ep.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">
                        S{ep.season}:E{ep.episode}
                      </span>
                      <h3 className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors">
                        {ep.title}
                      </h3>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      Episode {ep.episode} of season {ep.season}. Watch now in high quality.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
