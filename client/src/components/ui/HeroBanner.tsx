import { Play, Info } from "lucide-react";
import { Link } from "wouter";

interface HeroBannerProps {
  title: string;
  description: string;
  posterUrl: string;
  playUrl: string;
  infoUrl?: string;
  tag?: string;
}

export function HeroBanner({ title, description, posterUrl, playUrl, infoUrl, tag }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] lg:h-[85vh] flex items-center justify-start overflow-hidden bg-background">
      {/* Background Image with Gradients */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover object-center animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 max-w-3xl animate-slide-up">
        {tag && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4 border border-primary/20 backdrop-blur-sm">
            {tag}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 text-shadow-lg leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-300 mb-8 text-shadow-md line-clamp-3 max-w-xl font-medium">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={playUrl}
            className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </Link>
          
          {infoUrl && (
            <Link
              href={infoUrl}
              className="flex items-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full font-bold transition-all duration-300 hover:scale-105"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
