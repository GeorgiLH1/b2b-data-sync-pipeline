import type { ProductRepository, ProductView } from "./repository.js";

export function createInMemoryProductRepository(products: ProductView[]): ProductRepository {
  return {
    async list(category) {
      return category === undefined ? products : products.filter((p) => p.category === category);
    },
    async findById(id) {
      return products.find((p) => p.id === id) ?? null;
    },
  };
}
