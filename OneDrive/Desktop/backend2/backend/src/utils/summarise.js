import { genAI } from "../config/genAI.js";

export const summarizeResponse = async (query, context) => {
    try {
        if (!query || !context) {
            return {
                success: false,
                error: "Query and context are required for summarization"
            };
        }

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            You are an expert assistant for Adama Science and Technology University (ASTU).
Answer the user's question using ONLY the provided data.

Rules:
- Plain text only
- No formatting, lists, or symbols
- Clear and concise sentences
- Do not add or guess information
- Give Clear explanation

Question:
${query}

Data:
${context}
      `
        });


        return {
            success: true,
            finalResponse: response.text
        };

    } catch (err) {
        console.error("Summarization error:", err);
        return {
            success: false,
            error: "LLM summarization failed: " + (err.message || "Unknown error")
        };
    }
};

