import { embedGeneratedQuery } from "../../utils/embedQuery.js";
import { retrieveRelevantData } from "../../utils/retriveRelevantData.js";
import { summarizeResponse } from "../../utils/summarise.js";

export const ragService = {
    async query(userQuery) {
        try {
            // 1. Embed query
            const embedResult = await embedGeneratedQuery(userQuery);
            if (!embedResult.success) {
                return { success: false, error: embedResult.error };
            }

            // 2. Retrieve relevant data
            const retrieveResult = await retrieveRelevantData(embedResult.vector);
            if (!retrieveResult.success) {
                return { success: false, error: retrieveResult.error };
            }

            if (!retrieveResult.data || retrieveResult.data.length === 0) {
                return {
                    success: true,
                    data: "I couldn't find any relevant information in my database to answer your question."
                };
            }

            // 3. Summarize answer
            const summarizeResult = await summarizeResponse(userQuery, retrieveResult.data);
            if (!summarizeResult.success) {
                return { success: false, error: summarizeResult.error };
            }

            return {
                success: true,
                data: summarizeResult.finalResponse
            };

        } catch (error) {
            console.error("Error in ragService.query:", error);
            return {
                success: false,
                error: error.message || "An unexpected error occurred during RAG query"
            };
        }
    }
};
