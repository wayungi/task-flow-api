import request from "supertest";
import { describe, it } from "vitest";
import app from "../src/app.js";

describe("GET /api/health/server", () => {
  it("returns HTTP 200 with the server health as JSON", async () => {
    await request(app)
      .get("/api/health/server")
      .expect("Content-Type", /json/)
      .expect(200, { status: "OK" });
  });
});
