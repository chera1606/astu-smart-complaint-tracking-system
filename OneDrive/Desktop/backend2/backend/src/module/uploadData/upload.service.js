import { chunkText } from "../../utils/chunk.js";
import { getGeminiEmbedding } from "../../utils/embedData.js";
import { Data } from "../../model/db.js";

export const uploadDataService = {
    async upload(text) {
        try {
            // 1. Chunk the text
            const chunks = await chunkText(text);
            if (!chunks || chunks.length === 0) {
                return {
                    success: false,
                    error: "Failed to chunk text or text is empty"
                };
            }

            // 2. Generate embeddings for all chunks in one go (embedData.js handles batching)
            const embeddingResult = await getGeminiEmbedding(chunks, true);

            if (!embeddingResult.success) {
                return {
                    success: false,
                    error: embeddingResult.error || "Failed to generate embeddings"
                };
            }

            const vectors = embeddingResult.data;

            // 3. Prepare documents for insertion
            const documents = chunks.map((chunk, index) => ({
                content: chunk,
                embedding: vectors[index]
            }));

            // 4. Save to database
            const savedData = await Data.insertMany(documents);

            return {
                success: true,
                data: {
                    count: savedData.length,
                    message: "Data uploaded and embedded successfully"
                }
            };

        } catch (error) {
            console.error("Error in uploadDataService.upload:", error);
            return {
                success: false,
                error: error.message || "An unexpected error occurred during upload"
            };
        }
    }
};
