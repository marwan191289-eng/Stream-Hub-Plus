import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";

interface MediaItem {
  id: number | string;
  title: string;
  posterUrl: string;
  playUrl: string;
  badge?: string;
}

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  isChannel?: boolean;
}

export function MediaRow({ title, items, isChannel = false }: MediaRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!items?.length) return null;

  return (
    <div className="relative py-6 group">
      <div className="px-4 sm:px-6 lg:px-12 mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6 py-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex-none relative hover-poster cursor-pointer ${
                  isChannel ? "w-[160px] sm:w-[200px]" : "w-[140px] sm:w-[180px] lg:w-[220px]"
                }`}
              >
                <Link href={item.playUrl} className="block w-full h-full">
                  <div
                    className={`relative w-full overflow-hidden bg-zinc-900 rounded-xl border border-white/5 ${
                      isChannel ? "aspect-[4/3]" : "aspect-[2/3]"
                    }`}
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/poster:opacity-100" />
                    
                    {/* Hover Overlay Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 scale-75 group-hover/poster:scale-100 group-hover/poster:opacity-100">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-black/50">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                    </div>

                    {item.badge && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                        {item.badge}
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-2 opacity-0 transition-all duration-300 group-hover/poster:translate-y-0 group-hover/poster:opacity-100">
                      <h3 className="text-white font-bold text-sm truncate text-shadow-sm">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-2 transition-opacity duration-300 ${
            prevBtnEnabled ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={scrollPrev}
        >
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-primary/80 hover:scale-110 transition-all text-white">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </button>

        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-2 transition-opacity duration-300 ${
            nextBtnEnabled ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={scrollNext}
        >
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-primary/80 hover:scale-110 transition-all text-white">
            <ChevronRight className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
