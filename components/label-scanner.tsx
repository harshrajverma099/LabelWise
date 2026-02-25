"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface NutritionData {
  calories: number;
  protein: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  carbohydrates: number;
  sugar: number;
  fiber: number;
  sodium: number;
  cholesterol: number;
  servingSize: string;
  productName: string;
}

function getNutrientRating(data: NutritionData) {
  const ratings: { label: string; type: "good" | "warning" | "bad" }[] = [];
  if (data.protein >= 15) ratings.push({ label: "HIGH_PROTEIN", type: "good" });
  else if (data.protein >= 8) ratings.push({ label: "MED_PROTEIN", type: "warning" });
  else ratings.push({ label: "LOW_PROTEIN", type: "bad" });

  if (data.sugar <= 5) ratings.push({ label: "LOW_SUGAR", type: "good" });
  else if (data.sugar <= 12) ratings.push({ label: "MED_SUGAR", type: "warning" });
  else ratings.push({ label: "HIGH_SUGAR", type: "bad" });

  if (data.totalFat <= 5) ratings.push({ label: "LOW_FAT", type: "good" });
  else if (data.totalFat <= 15) ratings.push({ label: "MED_FAT", type: "warning" });
  else ratings.push({ label: "HIGH_FAT", type: "bad" });

  if (data.fiber >= 5) ratings.push({ label: "HIGH_FIBER", type: "good" });
  if (data.sodium >= 400) ratings.push({ label: "DANGER_SODIUM", type: "bad" });
  return ratings;
}

function getGoalVerdict(data: NutritionData, goal: "lose" | "gain" | "maintain") {
  if (goal === "lose") {
    if (data.calories <= 150 && data.protein >= 10 && data.sugar <= 8)
      return { verdict: "CLEARED :: FAT_LOSS", color: "text-primary neon-green", desc: "Low calorie. High protein. Low sugar. Target achieved for fat loss protocol." };
    if (data.calories > 300 || data.sugar > 15)
      return { verdict: "REJECTED :: FAT_LOSS", color: "text-accent neon-red", desc: "ALERT: High calorie/sugar density. Not compatible with fat loss objective." };
    return { verdict: "CONDITIONAL :: FAT_LOSS", color: "text-chart-4", desc: "Moderate risk. Limit intake. Monitor portions closely." };
  }
  if (goal === "gain") {
    if (data.calories >= 200 && data.protein >= 15)
      return { verdict: "CLEARED :: MUSCLE_GAIN", color: "text-primary neon-green", desc: "Calorie and protein dense. Optimal for muscle synthesis protocol." };
    if (data.calories < 100)
      return { verdict: "REJECTED :: MUSCLE_GAIN", color: "text-accent neon-red", desc: "ALERT: Insufficient caloric density. Requires higher energy intake." };
    return { verdict: "CONDITIONAL :: GAIN", color: "text-chart-4", desc: "Moderate compatibility. Pair with additional nutrient sources." };
  }
  if (data.calories >= 100 && data.calories <= 300 && data.protein >= 5 && data.sugar <= 12)
    return { verdict: "CLEARED :: MAINTENANCE", color: "text-primary neon-green", desc: "Balanced macro profile. Compatible with weight maintenance protocol." };
  return { verdict: "CAUTION :: MAINTENANCE", color: "text-chart-4", desc: "Monitor portion sizes to maintain caloric equilibrium." };
}

type InputMode = "image" | "manual";

export function LabelScanner() {
  const [inputMode, setInputMode] = useState<InputMode>("image");
  const [preview, setPreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [knownValues, setKnownValues] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState<"lose" | "gain" | "maintain">("maintain");
  const [scanProgress, setScanProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputModeRef = useRef<InputMode>(inputMode);
  inputModeRef.current = inputMode;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image too large. Use an image under 2MB for reliable upload.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!mountedRef.current) return;
      setPreview(ev.target?.result as string);
      setResult(null);
      setError(null);
      setScanProgress(0);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const analyzeLabel = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    setScanProgress(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setScanProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 12;
      });
    }, 150);
    intervalRef.current = interval;

    try {
      const res = await fetch("/api/analyze-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
        signal: controller.signal,
      });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: res.status === 413 ? "Image too large. Try a smaller image (under 3MB)." : "Server error. Try again." };
      }

      if (!mountedRef.current) return;
      clearInterval(interval);
      intervalRef.current = null;
      setScanProgress(100);

      if (!res.ok) {
        if (inputModeRef.current === "image") {
          setResult(null);
          setError(data.error || `Analysis failed (${res.status})`);
        }
        return;
      }
      if (inputModeRef.current === "image") setResult(data as NutritionData);
    } catch (err) {
      if (!mountedRef.current) return;
      clearInterval(interval);
      intervalRef.current = null;
      setScanProgress(100);
      if (err instanceof Error && err.name !== "AbortError" && inputModeRef.current === "image") {
        setResult(null);
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setAnalyzing(false);
      }
    }
  };

  const lookupProduct = async () => {
    const name = productName.trim();
    if (!name) return;
    setAnalyzing(true);
    setError(null);
    setScanProgress(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setScanProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 12;
      });
    }, 150);
    intervalRef.current = interval;

    try {
      const res = await fetch("/api/lookup-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: name,
          knownValues: knownValues.trim() || undefined,
        }),
        signal: controller.signal,
      });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: "Server error. Try again." };
      }

      if (!mountedRef.current) return;
      clearInterval(interval);
      intervalRef.current = null;
      setScanProgress(100);

      if (!res.ok) {
        if (inputModeRef.current === "manual") {
          setResult(null);
          setError(data.error || `Lookup failed (${res.status})`);
        }
        return;
      }
      if (inputModeRef.current === "manual") setResult(data as NutritionData);
    } catch (err) {
      if (!mountedRef.current) return;
      clearInterval(interval);
      intervalRef.current = null;
      setScanProgress(100);
      if (err instanceof Error && err.name !== "AbortError" && inputModeRef.current === "manual") {
        setResult(null);
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setAnalyzing(false);
      }
    }
  };

  const ratings = result ? getNutrientRating(result) : [];
  const verdict = result ? getGoalVerdict(result, goal) : null;

  return (
    <section id="scanner" className="relative border-t border-primary/10 bg-background px-4 py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Module_01 :: Nutrition Scanner
            </span>
          </div>
          <h2 className="text-balance font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Scan <span className="text-primary neon-green">Product</span> Label
          </h2>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {"// "}Upload image or enter product name. AI will extract and analyze nutritional data.
          </p>
        </div>

        <div className="mt-12 grid gap-px bg-primary/10 lg:grid-cols-2">
          {/* Input area */}
          <div className="border border-primary/10 bg-background p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="h-2 w-2 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Input Terminal
              </span>
            </div>

            {/* Mode toggle */}
            <div className="mb-4 flex gap-px bg-primary/10">
              <button
                type="button"
                onClick={() => {
                  abortControllerRef.current?.abort();
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                  setInputMode("image");
                  setResult(null);
                  setError(null);
                  setAnalyzing(false);
                }}
                className={`flex-1 border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  inputMode === "image"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                Scan Image
              </button>
              <button
                type="button"
                onClick={() => {
                  abortControllerRef.current?.abort();
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                  setInputMode("manual");
                  setResult(null);
                  setError(null);
                  setAnalyzing(false);
                }}
                className={`flex-1 border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  inputMode === "manual"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                Look Up by Name
              </button>
            </div>

            {inputMode === "image" ? (
            <div
              className="group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-card transition-all hover:border-primary/50 hover:bg-primary/5"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload product image"
            >
              {preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Product preview"
                    className="h-full max-h-[280px] w-full object-contain opacity-80"
                  />
                  <div className="absolute inset-0 scanlines" />
                  <div className="absolute bottom-2 left-2 border border-primary/30 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
                    TARGET_LOADED
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-primary/30 bg-primary/5 animate-pulse-neon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Click to upload target
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      PNG / JPG / WEBP :: MAX 10MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                aria-hidden="true"
              />
            </div>
            ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Quest Protein Bar Chocolate"
                  className="w-full border border-primary/20 bg-card px-3 py-2.5 text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Values You Can Read (optional)
                </label>
                <textarea
                  value={knownValues}
                  onChange={(e) => setKnownValues(e.target.value)}
                  placeholder="e.g. 20g protein, 200 cal, 60g serving, 6g sugar"
                  rows={3}
                  className="w-full resize-none border border-primary/20 bg-card px-3 py-2.5 text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                  {"// "}Enter any values you can read from the label. AI will use them to improve accuracy.
                </p>
              </div>
            </div>
            )}

            {/* Goal selector */}
            <div className="mt-4">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Select Objective
              </label>
              <div className="flex gap-px bg-primary/10">
                {(
                  [
                    { value: "lose", label: "FAT_LOSS" },
                    { value: "gain", label: "MUSCLE_GAIN" },
                    { value: "maintain", label: "MAINTAIN" },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGoal(g.value)}
                    className={`flex-1 border px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      goal === g.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scan progress */}
            {analyzing && (
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-primary">
                  <span>{inputMode === "image" ? "Scanning..." : "Looking up..."}</span>
                  <span>{Math.min(100, Math.round(scanProgress))}%</span>
                </div>
                <div className="h-1 overflow-hidden bg-card">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${Math.min(100, scanProgress)}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={inputMode === "image" ? analyzeLabel : lookupProduct}
              disabled={(inputMode === "image" ? !preview : !productName.trim()) || analyzing}
              className="mt-4 w-full border-2 border-primary bg-primary/10 font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted disabled:bg-muted/20 disabled:text-muted-foreground"
              size="lg"
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse bg-primary" />
                  {inputMode === "image" ? "Extracting Data..." : "Looking Up..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary" />
                  {inputMode === "image" ? "Execute Scan" : "Look Up Product"}
                </span>
              )}
            </Button>
          </div>

          {/* Results area */}
          <div
            className={`border border-primary/10 bg-background p-6 transition-opacity ${result || error ? "opacity-100" : "opacity-50"}`}
          >
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className={`h-2 w-2 ${result ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Output Terminal
              </span>
              {result && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-primary">
                  DATA_READY
                </span>
              )}
            </div>

            {error ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-accent">
                  Scan Failed
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {error}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Local: add OPENAI_API_KEY to .env.local and restart the dev server (pnpm dev).
                  <br />
                  Vercel: add OPENAI_API_KEY in Project Settings → Environment Variables, then redeploy.
                </p>
              </div>
            ) : !result ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center border border-border bg-card">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M7 2h10" />
                    <path d="M5 6h14" />
                    <rect width="18" height="12" x="3" y="10" rx="0" />
                  </svg>
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  {">"} Awaiting data...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-primary neon-green">
                    {result.productName}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Serving :: {result.servingSize}
                  </p>
                </div>

                {/* Ratings */}
                <div className="flex flex-wrap gap-1.5">
                  {ratings.map((r) => (
                    <span
                      key={r.label}
                      className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        r.type === "good"
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : r.type === "warning"
                            ? "border-chart-4/30 bg-chart-4/5 text-chart-4"
                            : "border-accent/30 bg-accent/5 text-accent"
                      }`}
                    >
                      {r.label}
                    </span>
                  ))}
                </div>

                {/* Goal verdict */}
                {verdict && (
                  <div className="border border-border bg-card p-3 danger-stripe">
                    <p className={`text-xs font-bold uppercase tracking-wider ${verdict.color}`}>
                      {verdict.verdict}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {verdict.desc}
                    </p>
                  </div>
                )}

                {/* Macro breakdown */}
                <div className="grid grid-cols-3 gap-px bg-primary/10">
                  <div className="flex flex-col items-center bg-background p-3">
                    <p className="font-display text-2xl font-bold text-primary neon-green">
                      {result.calories}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Calories
                    </p>
                  </div>
                  <div className="flex flex-col items-center bg-background p-3">
                    <p className="font-display text-2xl font-bold text-chart-3">
                      {result.protein}g
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Protein
                    </p>
                  </div>
                  <div className="flex flex-col items-center bg-background p-3">
                    <p className="font-display text-2xl font-bold text-accent neon-red">
                      {result.totalFat}g
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Fat
                    </p>
                  </div>
                </div>

                {/* Detailed nutrients */}
                <div className="flex flex-col gap-2.5">
                  <NutrientRow label="CARBS" value={result.carbohydrates} unit="g" max={50} />
                  <NutrientRow label="SUGAR" value={result.sugar} unit="g" max={30} />
                  <NutrientRow label="FIBER" value={result.fiber} unit="g" max={10} />
                  <NutrientRow label="SAT_FAT" value={result.saturatedFat} unit="g" max={20} />
                  <NutrientRow label="SODIUM" value={result.sodium} unit="mg" max={600} />
                  <NutrientRow label="CHOLESTEROL" value={result.cholesterol} unit="mg" max={100} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NutrientRow({
  label,
  value,
  unit,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const isHigh = percent > 70;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className={isHigh ? "text-accent" : "text-foreground"}>
          {value}
          {unit}
        </span>
      </div>
      <div className="h-1 overflow-hidden bg-card">
        <div
          className={`h-full transition-all duration-500 ${isHigh ? "bg-accent" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
