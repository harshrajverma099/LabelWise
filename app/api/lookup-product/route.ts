import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, knownValues } = body;

    if (!productName || typeof productName !== "string") {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const hints = knownValues?.trim()
      ? `\nThe user also provided these values they could read from the label (use to validate or fill in): ${knownValues}`
      : "";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a nutrition database. Look up the product "${productName}" and return its typical per-serving nutrition info. Use your knowledge of real branded products.${hints}

Return ONLY valid JSON in this exact format, with no extra text, code fences, or explanation:
{
  "productName": "string (format: BRAND :: FLAVOR/PRODUCT)",
  "servingSize": "string (e.g. 60g (1 bar) or 240ml (1 cup))",
  "calories": number,
  "protein": number,
  "totalFat": number,
  "saturatedFat": number,
  "transFat": number,
  "carbohydrates": number,
  "sugar": number,
  "fiber": number,
  "sodium": number,
  "cholesterol": number
}

Use 0 for values you cannot find. Be accurate for known products. If the product is obscure, provide best-estimate typical values for that product type.`;

    const geminiResult = await model.generateContent([
      { text: prompt },
    ]);

    const content = geminiResult.response.text().trim();
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch && !jsonStr.startsWith("{")) jsonStr = braceMatch[0];

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid format. Try a different product name." },
        { status: 500 }
      );
    }

    const result = {
      productName: String(data.productName || productName),
      servingSize: String(data.servingSize || "—"),
      calories: Number(data.calories) || 0,
      protein: Number(data.protein) || 0,
      totalFat: Number(data.totalFat) || 0,
      saturatedFat: Number(data.saturatedFat) || 0,
      transFat: Number(data.transFat) || 0,
      carbohydrates: Number(data.carbohydrates) || 0,
      sugar: Number(data.sugar) || 0,
      fiber: Number(data.fiber) || 0,
      sodium: Number(data.sodium) || 0,
      cholesterol: Number(data.cholesterol) || 0,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Product lookup error:", err);
    let message = "Lookup failed. Try again.";
    const errObj = err as { status?: number; message?: string };
    const errObj = err as { status?: number; message?: string };
    const status = errObj?.status;
    const msg = (errObj?.message || err instanceof Error ? (err as Error).message : "")?.toLowerCase();
    if (status === 401 || msg?.includes("invalid") || msg?.includes("incorrect api key")) {
      message = "Invalid API key. Add GEMINI_API_KEY in Vercel → Settings → Environment Variables, then redeploy.";
    } else if (status === 429 || msg?.includes("rate")) {
      message = "Rate limit exceeded or quota exceeded. Check your Gemini project limits.";
    } else if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
