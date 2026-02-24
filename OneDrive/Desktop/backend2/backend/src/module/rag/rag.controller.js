import { ragService } from "./rag.service.js";
import ragQuerySchema from "./rag.schema.js";

export const ragController = {
    async handleQuery(req, res) {
        try {
            // 1. Validate input
            const validation = ragQuerySchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    error: validation.error.errors[0].message
                });
            }

            const { query } = validation.data;

            // 2. Call Service
            const result = await ragService.query(query);

            // 3. Handle Service Result
            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });

        } catch (error) {
            console.error("Error in ragController.handleQuery:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }
};
