import express from "express";
import { productsRouter } from "./routes/products.js";
import { errorHandler, notFoundHandler } from "./middleware.js";

export const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
