import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { LabelScanner } from "@/components/label-scanner";
import { BmiCalculator } from "@/components/bmi-calculator";
import { DietPlanner } from "@/components/diet-planner";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LabelScanner />
        <BmiCalculator />
        <DietPlanner />
      </main>
      <Footer />
    </div>
  );
}
