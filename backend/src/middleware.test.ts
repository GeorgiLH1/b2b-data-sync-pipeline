import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";
import { createApp } from "./app.js";
import { errorHandler } from "./middleware.js";
import { createInMemoryProductRepository } from "./products/in-memory-repository.js";

const app = createApp({ products: createInMemoryProductRepository([]) });

describe("notFoundHandler", () => {
  it("returns JSON for an unknown route", async () => {
    const response = await request(app).get("/nope");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({ error: "route not found: GET /nope" });
  });

  it("reports the real HTTP method in the message", async () => {
    const response = await request(app).post("/nope");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "route not found: POST /nope" });
  });
});

describe("errorHandler", () => {
  it("returns 500 JSON without leaking details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const brokenApp = express();
    brokenApp.get("/boom", () => {
      throw new Error("secret database password is hunter2");
    });
    brokenApp.use(errorHandler);

    const response = await request(brokenApp).get("/boom");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal server error" });
    expect(JSON.stringify(response.body)).not.toContain("hunter2");
  });

  it("turns a failing repository into a 500 JSON response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const app = createApp({
      products: {
        async list() {
          throw new Error("database is down");
        },
        async findById() {
          throw new Error("database is down");
        },
      },
    });

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal server error" });
  });
});
