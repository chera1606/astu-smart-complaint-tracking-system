import { genAI } from "../config/genAI.js";

export async function getGeminiEmbedding(
    chunks,
    isAddingData = false,
    batchSize = 20
) {
    try {
        const vectors = [];

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            const response = await genAI.models.embedContent({
                model: "gemini-embedding-001",
                contents: batch,
                config: {
                    taskType: isAddingData
                        ? "RETRIEVAL_DOCUMENT"
                        : "RETRIEVAL_QUERY",
                },
            });

            if (!response.embeddings?.length) {
                return {
                    success: false,
                    error: "Gemini returned empty embeddings",
                };
            }

            const batchVectors = response.embeddings
                .map(e => e.values)
                .filter((v) => Array.isArray(v));

            vectors.push(...batchVectors);
        }

        return {
            success: true,
            data: vectors,
        };
    } catch (error) {
        console.error("Gemini embedding error:", error);

        return {
            success: false,
            error: "Failed to generate embeddings",
        };
    }
}
