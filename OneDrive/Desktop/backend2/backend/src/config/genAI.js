import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️  GEMINI_API_KEY not set - AI features will not work");
}

export const genAI = new GoogleGenAI({ apiKey });
