import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Play, Loader2 } from "lucide-react";

interface ExploreProps {
  type: "channels" | "movies" | "series";
}

export function Explore({ type }: ExploreProps) {
  // Use generic fetch based on type
  const { data, isLoading } = useQuery({
    queryKey: [`/api/${type}`],
    queryFn: async () => {
      const res = await fetch(`/api/${type}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const titles = {
    channels: "Live TV",
    movies: "Movies",
    series: "TV Series"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{titles[type]}</h1>
        <p className="text-zinc-400 text-lg">Browse all available {titles[type].toLowerCase()}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {data?.map((item: any, i: number) => {
          const isChannel = type === "channels";
          const playUrl = type === "series" ? `/series/${item.id}` : `/play/${type.slice(0,-1)}/${item.id}`;
          const posterUrl = isChannel ? item.logo : item.posterUrl;
          
          // Fallbacks for images
          const fallbackMovie = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop";
          const fallbackChannel = "https://images.unsplash.com/photo-1518930034639-6e3e551a37c9?w=500&h=375&fit=crop";

          return (
            <Link 
              key={item.id} 
              href={playUrl}
              className="group block animate-slide-up"
              style={{ animationDelay: `${(i % 10) * 50}ms` }}
            >
              <div className={`relative overflow-hidden bg-zinc-900 rounded-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/50 ${isChannel ? "aspect-[4/3]" : "aspect-[2/3]"}`}>
                <img
                  src={posterUrl || (isChannel ? fallbackChannel : fallbackMovie)}
                  alt={item.title || item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-black">
                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 leading-tight">
                    {item.title || item.name}
                  </h3>
                  {!isChannel && item.year && (
                    <p className="text-zinc-400 text-xs mt-1 font-medium">{item.year}</p>
                  )}
                  {isChannel && item.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-white/10 backdrop-blur rounded text-[10px] uppercase font-bold text-white tracking-wider">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
