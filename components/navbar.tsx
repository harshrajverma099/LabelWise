"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center border border-primary/50 bg-primary/10 animate-pulse-neon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary neon-green">
              LABELWISE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              // SYSTEM v2.0
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#scanner"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="h-1.5 w-1.5 border border-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary" />
            Scanner
          </a>
          <a
            href="#bmi"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="h-1.5 w-1.5 border border-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary" />
            BMI
          </a>
          <a
            href="#diet"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="h-1.5 w-1.5 border border-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary" />
            Diet AI
          </a>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <span className="font-mono text-xs tabular-nums text-primary/60">
            {time}
          </span>
          <Button
            asChild
            className="border border-primary bg-primary/10 text-primary uppercase tracking-widest hover:bg-primary hover:text-primary-foreground"
            size="sm"
          >
            <a href="#scanner" className="text-xs">
              Initialize
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-border text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-primary/10 bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {[
              { href: "#scanner", label: "Scanner" },
              { href: "#bmi", label: "BMI" },
              { href: "#diet", label: "Diet AI" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-primary/40">{">"}</span>
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="mt-2 border border-primary bg-primary/10 text-primary uppercase tracking-widest hover:bg-primary hover:text-primary-foreground"
              size="sm"
            >
              <a
                href="#scanner"
                onClick={() => setMobileOpen(false)}
                className="text-xs"
              >
                Initialize System
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
