
import { describe, it, expect } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";
import app from "../src/app.js";

const BASE_URL = "/api/tasks";

type TaskResponse = {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    createdAt: string;
    updatedAt: string;
};

// Helper: create a task for tests that need one.
async function createTestTask(
    title = "Test Task",
    description: string | null = "Test description"
): Promise<TaskResponse> {
    const response = await request(app)
        .post(BASE_URL)
        .send({ title, description });

    expect(response.status).toBe(201);

    return response.body as TaskResponse;
}

describe("Task API Integration Tests", () => {

    // ==========================================
    // POST /api/tasks
    // ==========================================

    describe("POST /api/tasks", () => {

        it("creates a task successfully", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({
                    title: "  Learn Express  ",
                    description: "Build REST APIs"
                });

            expect(response.status).toBe(201);

            expect(response.body).toMatchObject({
                title: "Learn Express",
                description: "Build REST APIs",
                status: "TODO"
            });

            expect(response.body.id).toEqual(expect.any(String));
            expect(response.body.createdAt).toEqual(expect.any(String));
            expect(response.body.updatedAt).toEqual(expect.any(String));

            expect(response.body.createdAt)
                .toBe(response.body.updatedAt);
        });

        it("creates a task without a description", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({ title: "Learn PostgreSQL" });

            expect(response.status).toBe(201);
            expect(response.body.description).toBeNull();
        });

        it("rejects a missing title", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({ description: "Some description" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Validation failed");
        });

        it("rejects an empty title", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({ title: "" });

            expect(response.status).toBe(400);
        });

        it("rejects a whitespace-only title", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({ title: "   " });

            expect(response.status).toBe(400);
        });

        it("rejects an invalid description type", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({
                    title: "Learn Express",
                    description: 123
                });

            expect(response.status).toBe(400);
        });

        it("rejects unsupported properties", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .send({
                    title: "Learn Express",
                    status: "DONE"
                });

            expect(response.status).toBe(400);
        });
    });

    // ==========================================
    // GET /api/tasks
    // ==========================================

    describe("GET /api/tasks", () => {

        it("returns an array of tasks", async () => {
            const response = await request(app).get(BASE_URL);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("includes a newly created task", async () => {
            const task = await createTestTask();

            const response = await request(app).get(BASE_URL);

            expect(response.status).toBe(200);

            expect(
                response.body.some(
                    (item: TaskResponse) => item.id === task.id
                )
            ).toBe(true);
        });
    });

    // ==========================================
    // GET /api/tasks/:id
    // ==========================================

    describe("GET /api/tasks/:id", () => {

        it("returns an existing task", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .get(`${BASE_URL}/${task.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(task.id);
            expect(response.body.title).toBe(task.title);
        });

        it("returns 400 for an invalid UUID", async () => {
            const response = await request(app)
                .get(`${BASE_URL}/invalid-id`);

            expect(response.status).toBe(400);
        });

        it("returns 404 for a nonexistent task", async () => {
            const response = await request(app)
                .get(`${BASE_URL}/${randomUUID()}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Task not found");
        });
    });

    // ==========================================
    // PATCH /api/tasks/:id
    // ==========================================

    describe("PATCH /api/tasks/:id", () => {

        it("updates only the title", async () => {
            const task = await createTestTask(
                "Original title",
                "Original description"
            );

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({ title: "Updated title" });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Updated title");
            expect(response.body.description)
                .toBe("Original description");
            expect(response.body.id).toBe(task.id);
            expect(response.body.createdAt).toBe(task.createdAt);
        });

        it("updates only the description", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({ description: "Updated description" });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(task.title);
            expect(response.body.description)
                .toBe("Updated description");
        });

        it("clears the description using null", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({ description: null });

            expect(response.status).toBe(200);
            expect(response.body.description).toBeNull();
        });

        it("updates both fields", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({
                    title: "New title",
                    description: "New description"
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe("New title");
            expect(response.body.description)
                .toBe("New description");
        });

        it("rejects an empty PATCH body", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({});

            expect(response.status).toBe(400);
        });

        it("rejects an empty title", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({ title: "   " });

            expect(response.status).toBe(400);
        });

        it("rejects unsupported fields", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .patch(`${BASE_URL}/${task.id}`)
                .send({ status: "DONE" });

            expect(response.status).toBe(400);
        });

        it("rejects an invalid UUID", async () => {
            const response = await request(app)
                .patch(`${BASE_URL}/invalid-id`)
                .send({ title: "Updated" });

            expect(response.status).toBe(400);
        });

        it("returns 404 for a nonexistent task", async () => {
            const response = await request(app)
                .patch(`${BASE_URL}/${randomUUID()}`)
                .send({ title: "Updated" });

            expect(response.status).toBe(404);
        });
    });

    // ==========================================
    // DELETE /api/tasks/:id
    // ==========================================

    describe("DELETE /api/tasks/:id", () => {

        it("deletes an existing task", async () => {
            const task = await createTestTask();

            const response = await request(app)
                .delete(`${BASE_URL}/${task.id}`);

            expect(response.status).toBe(200);
            expect(response.body.message)
                .toBe("Task deleted successfully");

            const getResponse = await request(app)
                .get(`${BASE_URL}/${task.id}`);

            expect(getResponse.status).toBe(404);
        });

        it("returns 404 when deleting twice", async () => {
            const task = await createTestTask();

            await request(app)
                .delete(`${BASE_URL}/${task.id}`);

            const response = await request(app)
                .delete(`${BASE_URL}/${task.id}`);

            expect(response.status).toBe(404);
        });

        it("rejects an invalid UUID", async () => {
            const response = await request(app)
                .delete(`${BASE_URL}/invalid-id`);

            expect(response.status).toBe(400);
        });

        it("returns 404 for a nonexistent task", async () => {
            const response = await request(app)
                .delete(`${BASE_URL}/${randomUUID()}`);

            expect(response.status).toBe(404);
        });
    });

    // ==========================================
    // ERROR HANDLING
    // ==========================================

    describe("Error handling", () => {

        it("returns 400 for malformed JSON", async () => {
            const response = await request(app)
                .post(BASE_URL)
                .set("Content-Type", "application/json")
                .send('{"title": "Broken JSON"');

            expect(response.status).toBe(400);
            expect(response.body.message)
                .toBe("Malformed JSON request");
        });
    });
});

