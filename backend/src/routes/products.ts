import { Router } from "express";
import type { ProductRepository } from "../products/repository.js";

const MAX_ID = 2_147_483_647;

export function createProductsRouter(repository: ProductRepository): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const { category } = req.query;
    const products = await repository.list(typeof category === "string" ? category : undefined);
    res.json(products);
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0 || id > MAX_ID) {
      res.status(400).json({ error: "id must be a positive integer" });
      return;
    }

    const product = await repository.findById(id);

    if (product === null) {
      res.status(404).json({ error: "product not found" });
      return;
    }

    res.json(product);
  });

  return router;
}
