import { z } from "zod";

export const createTaskSchema = z.strictObject({
    title: z.string().trim().min(1, "Title cannot be empty"),
    description: z.string().nullable().optional()
});

export const updateTaskSchema = z.strictObject({
    title: z.string().trim().min(1, "Title cannot be empty").optional,
    description: z.string().nullable().optional()
}).refine(
    data => data.title !== undefined || data.description !== undefined,
    {
        message: "At least one field must be provided"
    }
);


/*
    optional: allows property to be omitted
    nullable: allows the property to contain null


    z.object() accepts objects containing unknown properties but removes those properties from the parsed result.
    z.strictObject() rejects objects containing unknown properties.

    parse() throws a ZodError when validation fails.
    safeParse() does not throw for validation failures. Instead, it returns an object indicating success or failure.

*/