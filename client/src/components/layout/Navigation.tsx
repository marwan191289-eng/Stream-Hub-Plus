import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Tv, Film, MonitorPlay, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Live TV", href: "/live", icon: Tv },
    { name: "Movies", href: "/movies", icon: Film },
    { name: "Series", href: "/series", icon: MonitorPlay },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg shadow-black/20 py-3"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <MonitorPlay className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                Stream<span className="text-primary">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    location === link.href
                      ? "text-white bg-white/10"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                className="bg-black/40 border border-white/10 focus:border-primary focus:bg-black/60 text-white text-sm rounded-full pl-10 pr-4 py-2 w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              className="md:hidden text-zinc-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300 flex flex-col pt-24 px-6",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative mb-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium transition-all",
                location === link.href
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-zinc-300 hover:bg-white/5"
              )}
            >
              <link.icon className="w-6 h-6" />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
