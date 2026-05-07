"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-obsidian-light/20 animate-pulse shrink-0" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-obsidian-light/80 border border-glass-border hover:bg-obsidian-light hover:scale-105 active:scale-95 transition-all text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer shadow-sm flex items-center justify-center shrink-0 group relative overflow-hidden"
      title="Toggle Dark/Light Mode"
      aria-label="Toggle Dark/Light Mode"
    >
      <div className="absolute inset-0 bg-gradient-ai opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      {theme === "dark" ? (
        <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-neon-teal drop-shadow-[0_0_5px_rgba(45,212,191,0.5)] transition-transform duration-500 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-electric-indigo drop-shadow-[0_0_5px_rgba(99,102,241,0.5)] transition-transform duration-500 rotate-0" />
      )}
    </button>
  );
}
