import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navigation } from "@/components/layout/Navigation";
import { Home } from "@/pages/Home";
import { Explore } from "@/pages/Explore";
import { SeriesDetails } from "@/pages/SeriesDetails";
import { Player } from "@/pages/Player";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Don't show navigation on the player screen
  const isPlayer = location.startsWith("/play/");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      {!isPlayer && <Navigation />}
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/live">
            {() => <Explore type="channels" />}
          </Route>
          <Route path="/movies">
            {() => <Explore type="movies" />}
          </Route>
          <Route path="/series">
            {() => <Explore type="series" />}
          </Route>
          <Route path="/series/:id" component={SeriesDetails} />
          <Route path="/play/:type/:id" component={Player} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
