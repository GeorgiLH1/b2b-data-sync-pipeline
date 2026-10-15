import { Router } from "express";
import type { CleanProduct } from "../products.js";

export const productsRouter = Router();

const products: CleanProduct[] = [
  { id: 1, title: "Wireless Mouse", price: 25.5, category: "electronics" },
  { id: 2, title: "Desk Lamp", price: 18, category: "home" },
  { id: 3, title: "Notebook", price: 3.2, category: "uncategorized" },
];

productsRouter.get("/", (req, res) => {
  const { category } = req.query;

  if (typeof category === "string") {
    res.json(products.filter((p) => p.category === category));
    return;
  }

  res.json(products);
});

productsRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "id must be a positive integer" });
    return;
  }

  const product = products.find((p) => p.id === id);

  if (product === undefined) {
    res.status(404).json({ error: "product not found" });
    return;
  }

  res.json(product);
});
