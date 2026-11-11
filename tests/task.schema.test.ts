import { describe, expect, it } from "vitest";

import {
  createTaskSchema,
  taskParamsSchema,
  updateTaskSchema,
} from "../src/validators/task.schema.js";

describe("createTaskSchema", () => {
  it("accepts a valid task payload", () => {
    const result = createTaskSchema.parse({
      title: "  Finish report  ",
      description: "Update the quarterly report",
    });

    expect(result).toEqual({
      title: "Finish report",
      description: "Update the quarterly report",
    });
  });

  it("rejects an empty title", () => {
    expect(() => createTaskSchema.parse({ title: "   " })).toThrowError(
      /Title cannot be empty/i,
    );
  });

  it("rejects unknown properties", () => {
    expect(() =>
      createTaskSchema.parse({
        title: "Task",
        description: "Description",
        extra: "not allowed",
      }),
    ).toThrow();
  });
});

describe("updateTaskSchema", () => {
  it("accepts a valid partial update with a title", () => {
    const result = updateTaskSchema.parse({ title: "  Updated task  " });

    expect(result).toEqual({
      title: "Updated task",
    });
  });

  it("accepts a valid partial update with a description", () => {
    const result = updateTaskSchema.parse({ description: null });

    expect(result).toEqual({
      description: null,
    });
  });

  it("rejects an empty update payload", () => {
    expect(() => updateTaskSchema.parse({})).toThrowError(
      /At least one field must be provided/i,
    );
  });

  it("rejects an empty title in an update payload", () => {
    expect(() => updateTaskSchema.parse({ title: "   " })).toThrowError(
      /Title cannot be empty/i,
    );
  });
});

describe("taskParamsSchema", () => {
  it("accepts a valid UUID", () => {
    const result = taskParamsSchema.parse({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result).toEqual({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
  });

  it("rejects an invalid UUID", () => {
    expect(() => taskParamsSchema.parse({ id: "not-a-uuid" })).toThrow();
  });
});
