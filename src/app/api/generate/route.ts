import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { genAI as defaultGenAI } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const customKey = req.headers.get("x-custom-api-key");

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        let genAI = defaultGenAI;

        // If a custom key is provided and valid, use a new instance
        if (customKey && customKey !== "null" && customKey !== "undefined") {
            genAI = new GoogleGenerativeAI(customKey);
        }

        if (!genAI) {
            return NextResponse.json(
                { error: "API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local" },
                { status: 500 }
            );
        }

        // Initialize model with specific system instructions for this route
        // We use gemini-flash-latest as verified
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: `You are an expert frontend developer.
Goal: Generate production-ready HTML/Tailwind CSS based on the user's request.
Strict Rules:
1. Return ONLY the raw HTML string.
2. Do NOT use markdown code blocks.
3. Use Tailwind CSS for all styling.
4. Use inline SVGs (Lucide style) for icons.
5. NO <html>, <head>, or <body> tags.
6. Ensure responsive design (mobile-first).
7. Default to a clean, modern, professional aesthetic.`,
        });

        let result;
        let lastError;
        const maxRetries = 3;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                result = await model.generateContent(prompt);
                break; // Success
            } catch (error) {
                lastError = error;
                const err = error as any;
                // Only retry on 429 (Rate Limit) or 503 (Service Unavailable)
                if (attempt < maxRetries - 1 && (err.status === 429 || err.status === 503)) {
                    console.warn(`Attempt ${attempt + 1} failed with ${err.status}. Retrying...`);
                    // Wait 2s, 4s, etc.
                    await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
                    continue;
                }
                throw error; // Re-throw if not retriable or max retries reached
            }
        }

        if (!result) throw lastError;

        const response = result.response;
        let code = response.text();

        // Cleanup markdown if present (fallback)
        code = code.replace(/```html/g, "").replace(/```/g, "").trim();

        return NextResponse.json({ code });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        console.error("Generation Error:", err);

        let errorMessage = "Failed to generate UI.";
        let details = err?.message || "Unknown error";

        // Check for specific error types to provide better feedback
        if (err.message?.includes("API key")) {
            errorMessage = "Invalid or missing API Key.";
        } else if (err.status === 503) {
            errorMessage = "Service overloaded. Please try again.";
        } else if (err.status === 429) {
            errorMessage = "Rate limit exceeded. Please wait a moment.";
        }

        return NextResponse.json(
            { error: errorMessage, details },
            { status: err?.status || 500 }
        );
    }
}
