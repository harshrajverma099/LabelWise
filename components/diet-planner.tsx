"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
}

interface DayPlan {
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

function generateDietPlan(
  goal: string,
  activity: string,
  weightKg: number,
  heightCm: number,
  age: number,
  dietType: string
): DayPlan[] {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const tdee = bmr * (activityMultipliers[activity] || 1.2);

  let targetCalories = tdee;
  if (goal === "lose") targetCalories = tdee - 400;
  if (goal === "gain") targetCalories = tdee + 400;

  const cal = Math.round(targetCalories);
  const protein = Math.round(weightKg * (goal === "gain" ? 2.2 : 1.8));
  const fat = Math.round((cal * 0.25) / 9);
  const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const vegMeals = {
    breakfasts: [
      { name: "OATS_BERRY_BOWL", items: ["Rolled oats + almond milk", "Mixed berries", "Chia seeds", "Honey"] },
      { name: "AVO_TOAST_PROTOCOL", items: ["Whole grain bread", "Mashed avocado", "Cherry tomatoes", "Pumpkin seeds"] },
      { name: "SMOOTHIE_BOWL", items: ["Banana spinach blend", "Granola", "Almond butter", "Flax seeds"] },
      { name: "PANEER_PARATHA", items: ["Whole wheat paratha", "Paneer stuffing", "Mint chutney", "Curd"] },
      { name: "IDLI_SAMBAR", items: ["Steamed idli x4", "Sambar", "Coconut chutney", "Banana"] },
      { name: "VEGGIE_UPMA", items: ["Semolina upma", "Mixed vegetables", "Peanuts", "Lemon"] },
      { name: "DAL_CHEELA", items: ["Moong dal pancakes", "Green chutney", "Cucumber", "Buttermilk"] },
    ],
    lunches: [
      { name: "QUINOA_VEG_BOWL", items: ["Quinoa", "Roasted chickpeas", "Mixed greens", "Tahini dressing"] },
      { name: "DAL_BROWN_RICE", items: ["Masoor dal", "Brown rice", "Mixed veg sabzi", "Raita"] },
      { name: "RAJMA_RICE", items: ["Kidney bean curry", "Steamed rice", "Onion salad", "Pickle"] },
      { name: "CHOLE_ROTI", items: ["Chickpea curry", "Whole wheat roti", "Green salad", "Buttermilk"] },
      { name: "PASTA_PRIMAVERA", items: ["Whole wheat pasta", "Seasonal vegetables", "Olive oil", "Parmesan"] },
      { name: "STUFFED_PEPPERS", items: ["Bell peppers + rice", "Black beans", "Corn salsa", "Yogurt"] },
      { name: "BUDDHA_BOWL", items: ["Brown rice base", "Tofu cubes", "Edamame", "Sesame dressing"] },
    ],
    snacks: [
      { name: "TRAIL_MIX", items: ["Mixed nuts", "Dried cranberries", "Dark chocolate"] },
      { name: "HUMMUS_DIP", items: ["Hummus", "Carrot sticks", "Cucumber slices"] },
      { name: "YOGURT_CUP", items: ["Greek yogurt", "Honey", "Walnuts"] },
      { name: "PB_TOAST", items: ["Whole grain toast", "Peanut butter", "Banana slices"] },
      { name: "SPROUT_CHAAT", items: ["Mixed sprouts", "Onion + tomato", "Lemon + chaat masala"] },
      { name: "PROTEIN_SHAKE", items: ["Plant protein", "Banana", "Almond milk"] },
      { name: "ROASTED_MAKHANA", items: ["Fox nuts", "Ghee roasted", "Light salt"] },
    ],
    dinners: [
      { name: "PALAK_PANEER", items: ["Spinach paneer curry", "Whole wheat roti", "Onion salad", "Buttermilk"] },
      { name: "TOFU_STIRFRY", items: ["Tofu + mixed vegetables", "Soy ginger sauce", "Steamed rice", "Miso soup"] },
      { name: "KHICHDI_PROTOCOL", items: ["Rice + lentil khichdi", "Ghee", "Papad", "Pickle"] },
      { name: "VEG_CURRY", items: ["Mixed veg curry", "Jeera rice", "Cucumber raita", "Green salad"] },
      { name: "PANEER_TIKKA_WRAP", items: ["Whole wheat wrap", "Grilled paneer tikka", "Mint yogurt", "Onion rings"] },
      { name: "MUSHROOM_RISOTTO", items: ["Arborio rice", "Mixed mushrooms", "Parmesan", "Side salad"] },
      { name: "BAINGAN_BHARTA", items: ["Smoked eggplant curry", "Whole wheat roti", "Dal fry", "Salad"] },
    ],
  };

  const nonVegMeals = {
    breakfasts: [
      { name: "EGG_OMELETTE", items: ["4 egg whites + 1 whole", "Spinach + mushroom", "Whole grain toast", "Orange juice"] },
      { name: "CHICKEN_SAUSAGE", items: ["Chicken sausages", "Scrambled eggs", "Multigrain toast", "Avocado"] },
      { name: "PROTEIN_PANCAKES", items: ["Oat + egg pancakes", "Greek yogurt", "Mixed berries", "Maple drizzle"] },
      { name: "BOILED_EGG_SET", items: ["3 boiled eggs", "Whole wheat toast", "Avocado", "Black coffee"] },
      { name: "KEEMA_PARATHA", items: ["Minced chicken paratha", "Yogurt", "Green chutney", "Banana"] },
      { name: "TUNA_SANDWICH", items: ["Whole grain bread", "Tuna salad", "Lettuce + tomato", "Green tea"] },
      { name: "EGG_BHURJI", items: ["Spiced scrambled eggs", "Whole wheat roti", "Onion slices", "Chai"] },
    ],
    lunches: [
      { name: "GRILLED_CHICKEN", items: ["Grilled chicken breast", "Brown rice", "Steamed broccoli", "Lemon herb"] },
      { name: "FISH_CURRY", items: ["Fish curry", "Steamed rice", "Mixed salad", "Papad"] },
      { name: "CHICKEN_BIRYANI", items: ["Chicken biryani (portion)", "Raita", "Boiled egg", "Green salad"] },
      { name: "TURKEY_WRAP", items: ["Whole wheat wrap", "Sliced turkey", "Hummus", "Mixed greens"] },
      { name: "SALMON_QUINOA", items: ["Baked salmon fillet", "Quinoa pilaf", "Roasted asparagus", "Lemon"] },
      { name: "EGG_FRIED_RICE", items: ["Brown rice", "Scrambled eggs", "Mixed vegetables", "Soy sauce"] },
      { name: "CHICKEN_TIKKA", items: ["Chicken tikka", "Tandoori roti", "Mint chutney", "Onion rings"] },
    ],
    snacks: [
      { name: "PROTEIN_BAR", items: ["Protein bar", "Apple", "Green tea"] },
      { name: "CHICKEN_BITES", items: ["Grilled chicken strips", "Mustard dip", "Celery sticks"] },
      { name: "EGG_SALAD_CUP", items: ["Boiled eggs", "Mayo-light dressing", "Crackers"] },
      { name: "WHEY_SHAKE", items: ["Whey protein", "Banana", "Milk"] },
      { name: "TUNA_CRACKERS", items: ["Tuna spread", "Whole grain crackers", "Cherry tomatoes"] },
      { name: "YOGURT_NUTS", items: ["Greek yogurt", "Almonds", "Honey"] },
      { name: "BOILED_EGGS", items: ["2 boiled eggs", "Salt + pepper", "Fruit"] },
    ],
    dinners: [
      { name: "GRILLED_SALMON", items: ["Grilled salmon", "Sweet potato mash", "Green beans", "Lemon butter"] },
      { name: "CHICKEN_STEW", items: ["Chicken + veg stew", "Whole wheat bread", "Side salad", "Warm soup"] },
      { name: "TANDOORI_CHICKEN", items: ["Tandoori chicken leg", "Naan", "Mixed salad", "Mint raita"] },
      { name: "SHRIMP_STIRFRY", items: ["Garlic shrimp", "Rice noodles", "Bok choy", "Sesame oil"] },
      { name: "LEAN_STEAK", items: ["Grilled sirloin", "Roasted potatoes", "Caesar salad", "Grilled corn"] },
      { name: "EGG_CURRY", items: ["Egg curry", "Steamed rice", "Cucumber raita", "Papad"] },
      { name: "CHICKEN_SOUP", items: ["Chicken broth soup", "Vegetables", "Whole wheat roll", "Salad"] },
    ],
  };

  const meals = dietType === "veg" ? vegMeals : nonVegMeals;

  return days.map((day, i) => {
    const bf = meals.breakfasts[i % meals.breakfasts.length];
    const ln = meals.lunches[i % meals.lunches.length];
    const sn = meals.snacks[i % meals.snacks.length];
    const dn = meals.dinners[i % meals.dinners.length];

    const bfCal = Math.round(cal * 0.25);
    const lnCal = Math.round(cal * 0.35);
    const snCal = Math.round(cal * 0.1);
    const dnCal = Math.round(cal * 0.3);

    const makeMeal = (
      base: { name: string; items: string[] },
      mealCal: number,
      pFrac: number
    ): Meal => ({
      name: base.name,
      items: base.items,
      calories: mealCal,
      protein: Math.round(protein * pFrac),
      carbs: Math.round(carbs * pFrac),
      fat: Math.round(fat * pFrac),
    });

    return {
      day,
      meals: {
        breakfast: makeMeal(bf, bfCal, 0.25),
        lunch: makeMeal(ln, lnCal, 0.35),
        snack: makeMeal(sn, snCal, 0.1),
        dinner: makeMeal(dn, dnCal, 0.3),
      },
      totalCalories: cal,
      totalProtein: protein,
      totalCarbs: carbs,
      totalFat: fat,
    };
  });
}

export function DietPlanner() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [activity, setActivity] = useState("moderate");
  const [dietType, setDietType] = useState("nonveg");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [genProgress, setGenProgress] = useState(0);

  const handleGenerate = () => {
    const a = Number.parseFloat(age);
    const h = Number.parseFloat(height);
    const w = Number.parseFloat(weight);
    if (a <= 0 || h <= 0 || w <= 0) return;

    setGenerating(true);
    setGenProgress(0);

    const interval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setGenProgress(100);
      setPlan(generateDietPlan(goal, activity, w, h, a, dietType === "veg" ? "veg" : "nonveg"));
      setGenerating(false);
    }, 1500);
  };

  return (
    <section id="diet" className="relative border-t border-primary/10 bg-background px-4 py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-accent/20 bg-accent/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Module_03 :: AI Diet Engine 
            </span>
          </div>
          <h2 className="text-balance font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Deploy <span className="text-primary neon-green">Diet</span> Protocol
          </h2>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {"// "}Input parameters. AI will compute a 7-day optimized nutrition protocol.
          </p>
        </div>

        {/* Input form */}
        <div className="mx-auto mt-12 max-w-3xl border border-primary/10 bg-background p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <span className="h-2 w-2 bg-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
              Parameter Input
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="d-age" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Age
              </Label>
              <Input
                id="d-age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="d-height" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Height (cm)
              </Label>
              <Input
                id="d-height"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="d-weight" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Weight (kg)
              </Label>
              <Input
                id="d-weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Objective
              </Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="border-border bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  <SelectItem value="lose">FAT_LOSS</SelectItem>
                  <SelectItem value="gain">MUSCLE_GAIN</SelectItem>
                  <SelectItem value="maintain">MAINTENANCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Activity Level
              </Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger className="border-border bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  <SelectItem value="sedentary">SEDENTARY</SelectItem>
                  <SelectItem value="light">LIGHT_OPS</SelectItem>
                  <SelectItem value="moderate">MODERATE_OPS</SelectItem>
                  <SelectItem value="active">HIGH_ACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Diet Type
              </Label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger className="border-border bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  <SelectItem value="veg">VEGETARIAN</SelectItem>
                  <SelectItem value="nonveg">NON_VEG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress bar */}
          {generating && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-accent">
                <span>Generating protocol...</span>
                <span>{Math.min(100, Math.round(genProgress))}%</span>
              </div>
              <div className="h-1 overflow-hidden bg-card">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${Math.min(100, genProgress)}%` }}
                />
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="mt-6 w-full border-2 border-accent bg-accent/10 font-bold uppercase tracking-widest text-accent hover:bg-accent hover:text-accent-foreground disabled:border-muted disabled:text-muted-foreground"
            onClick={handleGenerate}
            disabled={!age || !height || !weight || generating}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse bg-accent" />
                Computing Diet Protocol...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent" />
                Generate Protocol
              </span>
            )}
          </Button>
        </div>

        {/* Results */}
        {plan && (
          <div className="mt-12">
            {/* Summary */}
            <div className="mx-auto mb-8 grid max-w-3xl grid-cols-2 gap-px bg-primary/10 sm:grid-cols-4">
              {[
                { value: plan[0].totalCalories, label: "DAILY_CALORIES", color: "text-primary neon-green" },
                { value: `${plan[0].totalProtein}g`, label: "PROTEIN", color: "text-chart-3" },
                { value: `${plan[0].totalCarbs}g`, label: "CARBS", color: "text-chart-4" },
                { value: `${plan[0].totalFat}g`, label: "FAT", color: "text-accent neon-red" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center border border-primary/10 bg-background p-4 text-center">
                  <p className={`font-display text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Day tabs */}
            <Tabs defaultValue="Monday" className="mx-auto max-w-4xl">
              <TabsList className="mx-auto flex w-full max-w-full flex-wrap justify-center gap-px bg-transparent p-0">
                {plan.map((d) => (
                  <TabsTrigger
                    key={d.day}
                    value={d.day}
                    className="border border-border bg-card text-[10px] font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    {d.day.slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {plan.map((d) => (
                <TabsContent key={d.day} value={d.day} className="mt-6">
                  <div className="grid gap-px bg-primary/10 sm:grid-cols-2">
                    {(Object.entries(d.meals) as [string, Meal][]).map(
                      ([mealType, meal]) => (
                        <MealCard key={mealType} mealType={mealType} meal={meal} />
                      )
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
}

function MealCard({ mealType, meal }: { mealType: string; meal: Meal }) {
  const mealLabels: Record<string, string> = {
    breakfast: "BREAKFAST",
    lunch: "LUNCH",
    snack: "SNACK",
    dinner: "DINNER",
  };

  const mealColors: Record<string, string> = {
    breakfast: "bg-primary text-primary-foreground",
    lunch: "bg-chart-3 text-primary-foreground",
    snack: "bg-chart-4 text-primary-foreground",
    dinner: "bg-accent text-accent-foreground",
  };

  const mealBorderColors: Record<string, string> = {
    breakfast: "border-primary/20",
    lunch: "border-chart-3/20",
    snack: "border-chart-4/20",
    dinner: "border-accent/20",
  };

  return (
    <div className={`border ${mealBorderColors[mealType] || "border-border"} bg-background p-5`}>
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center text-[10px] font-bold ${mealColors[mealType] || "bg-muted text-muted-foreground"}`}>
          {mealType.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {mealLabels[mealType] || mealType}
          </p>
          <p className="text-sm font-bold uppercase tracking-wider text-foreground">
            {meal.name}
          </p>
        </div>
      </div>

      <ul className="mb-4 flex flex-col gap-1">
        {meal.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 bg-primary/40" />
            {item}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-4 gap-px bg-primary/10">
        {[
          { val: meal.calories, label: "CAL" },
          { val: `${meal.protein}g`, label: "PRO" },
          { val: `${meal.carbs}g`, label: "CARB" },
          { val: `${meal.fat}g`, label: "FAT" },
        ].map((m) => (
          <div key={m.label} className="bg-card p-2 text-center">
            <p className="text-xs font-bold text-foreground">{m.val}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
