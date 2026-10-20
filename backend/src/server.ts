import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createPrismaClient } from "./db.js";
import { createPrismaProductRepository } from "./products/repository.js";

const config = loadConfig(process.env);
const prisma = createPrismaClient(config.DATABASE_URL);
const app = createApp({ products: createPrismaProductRepository(prisma) });

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT} (${config.NODE_ENV})`);
});
