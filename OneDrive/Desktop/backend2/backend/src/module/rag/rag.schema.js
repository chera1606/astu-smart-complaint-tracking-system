import { z } from "zod";

const ragQuerySchema = z.object({
    query: z.string().min(3, "Query must be at least 3 characters long"),
});

export default ragQuerySchema;
