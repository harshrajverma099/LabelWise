import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image data required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    // Parse data URL into base64 and mime type for Gemini
    const [header, base64Data] = image.split(",");
    const mimeMatch = header?.match(/data:(.*?);base64/);
    const mimeType = mimeMatch?.[1] || "image/png";
    if (!base64Data) {
      return NextResponse.json(
        { error: "Invalid image format. Try another image." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a nutrition label analyst. Analyze this product label image and extract the nutritional information.
Return ONLY valid JSON in this exact format, with no extra text, code fences, or explanation:
{
  "productName": "string (product name, use format like BRAND :: FLAVOR)",
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
Use 0 for any value you cannot find. Be accurate with numbers from the label.`;

    const geminiResult = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const content = geminiResult.response.text().trim();
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON from response (handle markdown code blocks or raw JSON)
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
        { error: "AI returned invalid format. Try again or use Look Up by Name." },
        { status: 500 }
      );
    }

    // Validate and normalize
    const result = {
      productName: String(data.productName || "UNKNOWN_PRODUCT"),
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
    console.error("Label analysis error:", err);
    let message = "Analysis failed. Try again.";
    const errObj = err as { status?: number; message?: string };
    const status = errObj?.status;
    const msg = (errObj?.message || err instanceof Error ? (err as Error).message : "")?.toLowerCase();
    if (status === 401 || msg?.includes("invalid") || msg?.includes("incorrect api key")) {
      message = "Invalid API key. Add GEMINI_API_KEY in Vercel → Settings → Environment Variables, then redeploy.";
    } else if (status === 429 || msg?.includes("rate")) {
      message = "Rate limit exceeded. Wait a moment and try again.";
    } else if (status === 413 || msg?.includes("413")) {
      message = "Image too large. Use a smaller image (under 3MB).";
    } else if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
