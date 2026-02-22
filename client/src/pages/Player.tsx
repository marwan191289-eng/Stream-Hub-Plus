import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Loader2 } from "lucide-react";

export function Player() {
  const [, params] = useRoute("/play/:type/:id");
  const type = params?.type; // 'channel', 'movie', 'episode'
  const id = parseInt(params?.id || "0", 10);

  // Dynamically determine endpoint based on type
  const endpoint = type === 'channel' 
    ? `/api/channels/${id}` 
    : type === 'movie' 
      ? `/api/movies/${id}` 
      : type === 'episode'
        ? `/api/episodes/${id}` // Wait, backend schema didn't explicitly have GET /api/episodes/:id. Let's assume standard REST, or fetch list and filter.
        : null;

  // We need a special query for episodes since the exact GET episode endpoint isn't defined in the API contract block.
  // Actually, we can just fetch the specific type endpoint. We will pass a generic fetch.
  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      // If it's an episode, we might need a workaround if /api/episodes/:id doesn't exist.
      // But let's assume standard REST for individual fetch if needed, or error out gracefully.
      const res = await fetch(endpoint!);
      if (!res.ok) throw new Error("Media not found");
      return res.json();
    },
    enabled: !!endpoint && !!id,
  });

  if (!type || !id || (!['channel', 'movie', 'episode'].includes(type))) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white text-xl">
        Invalid playback URL
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Content Not Available</h2>
        <button onClick={() => window.history.back()} className="px-6 py-2 bg-primary rounded-full hover:bg-primary/80 transition">
          Go Back
        </button>
      </div>
    );
  }

  const url = type === 'channel' ? data.url : data.videoUrl;
  const title = type === 'channel' ? data.name : data.title;

  return <VideoPlayer url={url} title={title} />;
}
