import type { PrismaClient } from "../generated/prisma/client.js";

export interface ProductView {
  id: number;
  title: string;
  price: number;
  category: string;
}

export interface ProductRepository {
  list(category?: string): Promise<ProductView[]>;
  findById(id: number): Promise<ProductView | null>;
}

export function createPrismaProductRepository(prisma: PrismaClient): ProductRepository {
  return {
    async list(category) {
      const rows = await prisma.product.findMany({
        where: category === undefined ? {} : { category },
        orderBy: { id: "asc" },
      });
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        price: row.price.toNumber(),
        category: row.category,
      }));
    },

    async findById(id) {
      const row = await prisma.product.findUnique({ where: { id } });
      if (row === null) {
        return null;
      }
      return {
        id: row.id,
        title: row.title,
        price: row.price.toNumber(),
        category: row.category,
      };
    },
  };
}
