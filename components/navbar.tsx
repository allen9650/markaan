"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Moon, Sun, Sparkles, Image as ImageIcon } from "lucide-react";

interface NavbarProps {
  totalCount: number;
  completedCount: number;
}

export function Navbar({ totalCount, completedCount }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Markaan
              </h1>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                by Ahsan Raza
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Professional local bulk image watermarking
            </p>
          </div>
        </div>

        {/* Local Security Notice & Theme Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">100% Local • Zero Cloud Uploads</span>
          </div>

          {totalCount > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs text-secondary-foreground font-medium border border-border">
              <ImageIcon className="w-3.5 h-3.5 text-primary" />
              <span>{completedCount} / {totalCount} Processed</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
