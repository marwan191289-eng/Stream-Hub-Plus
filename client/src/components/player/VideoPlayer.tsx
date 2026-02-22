import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface VideoPlayerProps {
  url: string;
  title: string;
  onBack?: () => void;
}

export function VideoPlayer({ url, title, onBack }: VideoPlayerProps) {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use proxy to bypass CORS if it's an external URL
  const streamUrl = url.startsWith('http') 
    ? `/api/proxy?url=${encodeURIComponent(url)}` 
    : url;

  const handleBack = () => {
    if (onBack) onBack();
    else setLocation(-1 as any); // Go back in history
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col group">
      {/* Top Bar - Fades out when playing and mouse is still (handled by ReactPlayer controls in full screen, but we add a custom back button) */}
      <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-bold text-shadow-md truncate max-w-lg">
          {title}
        </h1>
      </div>

      {!isReady && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-0">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-zinc-400 font-medium">Loading stream...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-0 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
            <span className="text-destructive font-bold text-xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Playback Error</h2>
          <p className="text-zinc-400 max-w-md">{error}</p>
          <button 
            onClick={handleBack}
            className="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      )}

      <div className="w-full h-full flex-1 relative">
        <ReactPlayer
          url={streamUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={true}
          onReady={() => setIsReady(true)}
          onError={(e) => {
            console.error("Player Error:", e);
            setError("The stream could not be loaded. It may be offline or geoblocked.");
            setIsReady(false);
          }}
          config={{
            file: {
              forceHLS: true,
              hlsOptions: {
                maxMaxBufferLength: 100,
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
}
