"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const statusMessages = [
  "NUTRITION_DB :: LOADED",
  "AI_ENGINE :: ONLINE",
  "SCAN_MODULE :: READY",
  "BMI_PROTOCOL :: ARMED",
  "DIET_AI :: INITIALIZED",
];

export function Hero() {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % statusMessages.length);
    }, 2000);
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => {
      clearInterval(msgInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-background px-4 pb-20 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 scanlines" />

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 border-primary/20 lg:left-8 lg:top-8" />
      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2 border-primary/20 lg:right-8 lg:top-8" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 border-primary/20 lg:bottom-8 lg:left-8" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-primary/20 lg:bottom-8 lg:right-8" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Status line */}
          <div className="mb-8 inline-flex items-center gap-3 border border-primary/20 bg-primary/5 px-5 py-2">
            <span className="h-2 w-2 animate-pulse bg-primary" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {statusMessages[currentMsg]}
              {showCursor && (
                <span className="ml-1 text-primary">_</span>
              )}
            </span>
          </div>

          <h1 className="text-balance font-display text-4xl font-bold uppercase leading-none tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="block text-primary neon-green animate-flicker">
              Decode
            </span>
            <span className="block mt-2">What You</span>
            <span className="block mt-2 text-accent neon-red">Consume</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-pretty text-sm uppercase leading-relaxed tracking-wider text-muted-foreground md:text-base">
            {"// "}Tactical nutrition intelligence system. Scan product labels.
            Analyze macros. Calculate BMI. Deploy AI-generated diet protocols.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group border-2 border-primary bg-primary/10 px-8 text-sm font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <a href="#scanner" className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 bg-primary transition-colors group-hover:bg-primary-foreground" />
                Deploy Scanner
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-accent/40 bg-transparent px-8 text-sm font-bold uppercase tracking-widest text-accent transition-all hover:border-accent hover:bg-accent/10"
            >
              <a href="#bmi" className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 border border-accent" />
                Run BMI Check
              </a>
            </Button>
          </div>
        </div>

        {/* Data cards row */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px bg-primary/10 sm:grid-cols-3">
          {[
            { value: "100+", label: "NUTRIENTS_TRACKED", status: "ACTIVE" },
            { value: "< 2s", label: "SCAN_LATENCY", status: "OPTIMAL" },
            { value: "AI", label: "DIET_ENGINE", status: "ONLINE" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center border border-primary/10 bg-background p-6 text-center transition-colors hover:bg-primary/5"
            >
              <span className="font-display text-3xl font-bold text-primary neon-green md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary/60">
                <span className="h-1 w-1 animate-pulse bg-primary" />
                {stat.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
