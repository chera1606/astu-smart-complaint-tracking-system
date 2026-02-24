import { Data } from "../model/db.js";

export const searchSimilarData = async (userInputVector) => {
    try {

        const pipeline = [];

        const vectorSearchStage = {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: userInputVector,
                numCandidates: 100,
                limit: 20
            }
        };

        pipeline.push(vectorSearchStage);

        // Continue with existing pipeline stages
        pipeline.push(
            {
                $project: {
                    content: 1,
                    _id: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match: {
                    score: { $gte: 0.5 }
                }
            },
            {
                $limit: 5
            }
        );

        const result = await Data.aggregate(pipeline);

        return result;

    } catch (error) {
        console.log(`Search failed: ${error.message}`);
        console.log("Full error:", error);
        return [];
    }
}
