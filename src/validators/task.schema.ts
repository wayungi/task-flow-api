import { z } from "zod";

export const createTaskSchema = z.strictObject({
    title: z.string().trim().min(1, "Title cannot be empty"),
    description: z.string().nullable().optional()
});

