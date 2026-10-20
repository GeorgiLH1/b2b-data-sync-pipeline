import express from "express";
import type { Express } from "express";
import { errorHandler, notFoundHandler } from "./middleware.js";
import type { ProductRepository } from "./products/repository.js";
import { createProductsRouter } from "./routes/products.js";

export interface AppDependencies {
  products: ProductRepository;
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/products", createProductsRouter(deps.products));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
