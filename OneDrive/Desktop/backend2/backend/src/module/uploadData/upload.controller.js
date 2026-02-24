import { uploadDataService } from "./upload.service.js";
import uploadDataSchema from "./upload.schema.js";

export const uploadDataController = {
    async uploadData(req, res) {
        try {
            // 1. Validate input
            const validation = uploadDataSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    error: validation.error.errors[0].message
                });
            }

            const { text } = validation.data;

            // 2. Call Service
            const result = await uploadDataService.upload(text);

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
            console.error("Error in uploadDataController.uploadData:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }
}
