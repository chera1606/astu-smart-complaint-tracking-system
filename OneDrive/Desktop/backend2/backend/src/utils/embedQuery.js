import { genAI } from "../config/genAI.js";

export const embedGeneratedQuery = async (query) => {
    try {
        if (!query) {
            return {
                success: false,
                error: "Query is required"
            };
        }

        const response = await genAI.models.embedContent({
            model: "gemini-embedding-001",
            contents: [query],
            config: { taskType: "RETRIEVAL_QUERY" }
        });

        if (!response?.embeddings?.[0]?.values) {
            return {
                success: false,
                error: "Failed to generate query embedding"
            };
        }

        return {
            success: true,
            vector: response.embeddings[0].values
        };

    } catch (error) {
        console.error("Embedding error:", error);
        return {
            success: false,
            error: error?.message || "Unexpected embedding error"
        };
    }
};

