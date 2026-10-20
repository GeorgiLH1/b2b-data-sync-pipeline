import "dotenv/config";
import { loadConfig } from "../config.js";
import { createPrismaClient } from "../db.js";

const sampleProducts = [
  { externalId: "1", title: "Wireless Mouse", category: "electronics", price: "25.50" },
  { externalId: "2", title: "Desk Lamp", category: "home", price: "18.00" },
  { externalId: "3", title: "Notebook", category: "uncategorized", price: "3.20" },
];

const config = loadConfig(process.env);
const prisma = createPrismaClient(config.DATABASE_URL);

try {
  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { source_externalId: { source: "SEED", externalId: product.externalId } },
      update: { title: product.title, category: product.category, price: product.price },
      create: { source: "SEED", ...product },
    });
  }
  console.log(`Seeded ${sampleProducts.length} products`);
} finally {
  await prisma.$disconnect();
}
