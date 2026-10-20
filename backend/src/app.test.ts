import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { createInMemoryProductRepository } from "./products/in-memory-repository.js";

const sampleProducts = [
  { id: 1, title: "Wireless Mouse", price: 25.5, category: "electronics" },
  { id: 2, title: "Desk Lamp", price: 18, category: "home" },
  { id: 3, title: "Notebook", price: 3.2, category: "uncategorized" },
];

const app = createApp({ products: createInMemoryProductRepository(sampleProducts) });

describe("GET /api/health", () => {
  it("responds with 200 and status ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("GET /api/products/:id", () => {
  it("returns all products", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("filters by category", async () => {
    const response = await request(app).get("/api/products?category=home");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Desk Lamp");
  });
  it("returns one product", async () => {
    const response = await request(app).get("/api/products/2");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Desk Lamp");
  });

  it("returns 404 when the product does not exist", async () => {
    const response = await request(app).get("/api/products/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "product not found" });
  });

  for (const badId of ["abc", "0", "-5", "1.5", "2147483648"]) {
    it(`returns 400 for the invalid id "${badId}"`, async () => {
      const response = await request(app).get(`/api/products/${badId}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "id must be a positive integer" });
    });
  }
});
