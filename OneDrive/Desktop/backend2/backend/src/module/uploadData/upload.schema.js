import { z } from "zod";

const uploadDataSchema = z.object({
    text: z.string().min(50, "Text must be at least 50 characters long"),
})

export default uploadDataSchema
