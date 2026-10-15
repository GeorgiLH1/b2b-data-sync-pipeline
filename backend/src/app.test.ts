import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js";

describe("GET /api/health", () => {
  it("responds with 200 and status ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("unknown routes", () => {
  it("responds with 404", async () => {
    const response = await request(app).get("/nope");

    expect(response.status).toBe(404);
  });
});
