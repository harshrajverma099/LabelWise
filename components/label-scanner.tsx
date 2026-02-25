"use client";

import { Button } from "@/components/ui/button";

const SCAN_URL = "https://vm-rg49lea2yneex3xup5do73.vusercontent.net";

export function LabelScanner() {
  return (
    <section id="scanner" className="relative border-t border-primary/10 bg-background px-4 py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Module_01 :: Food Scanner
            </span>
          </div>
          <h2 className="text-balance font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Scan <span className="text-primary neon-green">Your Food</span>
          </h2>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {"// "}Continue scanning on the dedicated label scanner.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="border-2 border-primary bg-primary/10 font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a href={SCAN_URL} target="_blank" rel="noreferrer">
                Scan Your Food
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
