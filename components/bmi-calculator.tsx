"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  glowClass: string;
  description: string;
  tip: string;
  threatLevel: string;
}

function calculateBmi(age: number, heightCm: number, weightKg: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  if (rounded < 18.5) {
    return {
      bmi: rounded,
      category: "UNDERWEIGHT",
      color: "text-chart-3",
      glowClass: "",
      threatLevel: "LOW_MASS",
      description: "BMI indicates mass deficit. Caloric surplus required. Focus on nutrient-dense fuel sources.",
      tip: age < 25
        ? "Deploy protein-rich meals and strength protocols to build healthy mass."
        : "Consult a nutrition specialist. Implement structured weight-gain protocol.",
    };
  }
  if (rounded < 25) {
    return {
      bmi: rounded,
      category: "OPTIMAL",
      color: "text-primary",
      glowClass: "neon-green",
      threatLevel: "CLEAR",
      description: "BMI is within optimal parameters. All systems nominal. Maintain current protocol.",
      tip: age < 25
        ? "Keep active. Maintain consistent fuel schedule. Stay disciplined."
        : "Continue current routine. Prioritize whole foods, hydration, and recovery.",
    };
  }
  if (rounded < 30) {
    return {
      bmi: rounded,
      category: "OVERWEIGHT",
      color: "text-chart-4",
      glowClass: "",
      threatLevel: "ELEVATED",
      description: "BMI exceeds optimal range. Caloric deficit and increased activity recommended.",
      tip: age < 25
        ? "Initiate 30-min daily activity. Reduce processed fuel intake immediately."
        : "Implement portion control. Target 150 min moderate exercise per week.",
    };
  }
  return {
    bmi: rounded,
    category: "OBESE",
    color: "text-accent",
    glowClass: "neon-red",
    threatLevel: "CRITICAL",
    description: "BMI indicates critical mass levels. Immediate intervention recommended. Seek professional guidance.",
    tip: "Begin low-impact exercise protocols. Prioritize vegetables, lean protein, whole grains.",
  };
}

export function BmiCalculator() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [result, setResult] = useState<BmiResult | null>(null);

  const handleCalculate = () => {
    const a = Number.parseFloat(age);
    const h = Number.parseFloat(height);
    const w = Number.parseFloat(weight);
    if (a > 0 && h > 0 && w > 0) {
      setResult(calculateBmi(a, h, w));
    }
  };

  const bmiScalePercent = result
    ? Math.min(Math.max(((result.bmi - 10) / 35) * 100, 0), 100)
    : 0;

  return (
    <section id="bmi" className="relative border-t border-primary/10 bg-background px-4 py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Module_02 :: BMI Analysis
            </span>
          </div>
          <h2 className="text-balance font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Body Mass <span className="text-accent neon-red">Index</span>
          </h2>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {"// "}Enter biometric data. System will compute BMI and return threat assessment.
          </p>
        </div>

        <div className="mt-12 grid gap-px bg-primary/10 lg:grid-cols-2">
          {/* Input */}
          <div className="border border-primary/10 bg-background p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="h-2 w-2 bg-chart-3" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Biometric Input
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Gender */}
              <div>
                <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Gender
                </Label>
                <div className="flex gap-px bg-primary/10">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`flex-1 border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      gender === "male"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    MALE
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`flex-1 border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      gender === "female"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    FEMALE
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="age" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={1}
                  max={120}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="height" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min={50}
                  max={250}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min={10}
                  max={400}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <Button
                size="lg"
                className="w-full border-2 border-primary bg-primary/10 font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted disabled:text-muted-foreground"
                onClick={handleCalculate}
                disabled={!age || !height || !weight}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary" />
                  Execute Analysis
                </span>
              </Button>
            </div>
          </div>

          {/* Result */}
          <div className={`border border-primary/10 bg-background p-6 transition-opacity ${result ? "opacity-100" : "opacity-50"}`}>
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className={`h-2 w-2 ${result ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Analysis Output
              </span>
              {result && (
                <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${result.color}`}>
                  {result.threatLevel}
                </span>
              )}
            </div>

            {!result ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  {">"} Awaiting biometric input...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* BMI number */}
                <div className="text-center">
                  <p className={`font-display text-6xl font-bold ${result.color} ${result.glowClass}`}>
                    {result.bmi}
                  </p>
                  <p className={`mt-2 text-sm font-bold uppercase tracking-[0.3em] ${result.color}`}>
                    {result.category}
                  </p>
                </div>

                {/* BMI scale - cyberpunk style */}
                <div className="relative">
                  <div className="flex h-2 overflow-hidden">
                    <div className="flex-1 bg-chart-3/60" />
                    <div className="flex-1 bg-primary/60" />
                    <div className="flex-1 bg-chart-4/60" />
                    <div className="flex-1 bg-accent/60" />
                  </div>
                  <div
                    className="absolute -top-1 h-4 w-0.5 bg-foreground transition-all duration-700"
                    style={{ left: `${bmiScalePercent}%` }}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>{"< 18.5"}</span>
                    <span>18.5-24.9</span>
                    <span>25-29.9</span>
                    <span>{"30+"}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider">
                    <span className="text-chart-3">UNDER</span>
                    <span className="text-primary">OPTIMAL</span>
                    <span className="text-chart-4">OVER</span>
                    <span className="text-accent">OBESE</span>
                  </div>
                </div>

                {/* Info */}
                <div className="border border-border bg-card p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {"// "}System Assessment
                  </p>
                  <p className="mt-2 text-xs uppercase leading-relaxed tracking-wider text-foreground">
                    {result.description}
                  </p>
                </div>

                {/* Tip */}
                <div className="border border-primary/20 bg-primary/5 p-4 danger-stripe">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    Protocol Recommendation
                  </p>
                  <p className="mt-2 text-xs uppercase leading-relaxed tracking-wider text-foreground">
                    {result.tip}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
