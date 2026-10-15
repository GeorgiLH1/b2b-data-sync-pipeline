import express from "express";
import { productsRouter } from "./routes/products.js";

export const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
