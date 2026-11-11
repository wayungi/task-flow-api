import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../src/app.js";

const createdTaskIds: string[] = [];

afterEach(async () => {
  await Promise.all(
    createdTaskIds.splice(0).map((id) => request(app).delete(`/api/tasks/${id}`)),
  );
});

async function createTestTask(title = "Test task", description = "Task description") {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title, description })
    .expect(201);

  createdTaskIds.push(response.body.id);
  return response.body;
}

describe("task routes", () => {
  it("GET /api/tasks returns the task list", async () => {
    const task = await createTestTask();

    const response = await request(app).get("/api/tasks").expect(200);

    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(task)]));
  });

  it("GET /api/tasks/:id returns the requested task", async () => {
    const task = await createTestTask();

    const response = await request(app).get(`/api/tasks/${task.id}`).expect(200);

    expect(response.body).toEqual(task);
  });

  it("POST /api/tasks creates and returns a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "New task", description: "New task description" })
      .expect(201);

    createdTaskIds.push(response.body.id);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "New task",
        description: "New task description",
        status: "TODO",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it("PUT /api/tasks/:id updates and returns the task", async () => {
    const task = await createTestTask();

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: "Updated task", description: "Updated description" })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: task.id,
        title: "Updated task",
        description: "Updated description",
        status: task.status,
        createdAt: task.createdAt,
      }),
    );
  });

  it("DELETE /api/tasks/:id deletes the task", async () => {
    const task = await createTestTask();

    const response = await request(app).delete(`/api/tasks/${task.id}`).expect(200);

    expect(response.body).toEqual({ message: "Task deleted successfully" });

    const tasks = await request(app).get("/api/tasks").expect(200);
    expect(tasks.body).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: task.id })]));
    createdTaskIds.splice(createdTaskIds.indexOf(task.id), 1);
  });
});
