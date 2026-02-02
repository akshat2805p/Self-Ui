import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Fail-safe initialization
// We do NOT throw at the top level to prevent build crashes or client-side crashes if imported
// The check should happen when the model is actually used.

const safeGenAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const genAI = safeGenAI;

export const model = safeGenAI
    ? safeGenAI.getGenerativeModel({ model: "gemini-flash-latest" })
    : null;

export const getModel = () => {
    if (!model) {
        throw new Error("Gemini API Key is missing. Please check .env.local");
    }
    return model;
};
