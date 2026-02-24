import { Data } from "../model/db.js";

export const retrieveRelevantData = async (vector) => {
    try {
        if (!vector || !Array.isArray(vector)) {
            return {
                success: false,
                error: "Valid vector is required for retrieval"
            };
        }

        // Using MongoDB Atlas Vector Search (requires index named 'vector_index')
        const results = await Data.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: vector,
                    numCandidates: 100,
                    limit: 5
                }
            },
            {
                $project: {
                    content: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        if (!results || results.length === 0) {
            return {
                success: true,
                data: ""
            };
        }


        const combinedContent = results.map(r => r.content).join("\n\n");


        return {
            success: true,
            data: combinedContent
        };

    } catch (error) {
        console.error("Data retrieval error:", error);

        return {
            success: false,
            error: "Vector search failed. Ensure 'vector_index' is created in MongoDB Atlas and configured correctly."
        };
    }
};
