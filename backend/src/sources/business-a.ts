import { z } from "zod";
import { cleanProduct } from "../products.js";

export interface ProductInput {
  source: "BUSINESS_A";
  externalId: string;
  title: string;
  category: string;
  price: number;
}

export interface RejectedRecord {
  index: number;
  externalId: string | null;
  reasons: string[];
}

export interface ParseResult {
  products: ProductInput[];
  rejected: RejectedRecord[];
}

const businessAProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  price: z.number().nonnegative(),
  category: z.string().nullish(),
});

function readExternalId(record: unknown): string | null {
  if (typeof record === "object" && record !== null && "id" in record) {
    return String(record.id);
  }
  return null;
}

export function parseBusinessAProducts(payload: unknown): ParseResult {
  if (!Array.isArray(payload)) {
    throw new Error("Business A response is not a list of products");
  }

  const products: ProductInput[] = [];
  const rejected: RejectedRecord[] = [];

  payload.forEach((record: unknown, index) => {
    const result = businessAProductSchema.safeParse(record);

    if (!result.success) {
      rejected.push({
        index,
        externalId: readExternalId(record),
        reasons: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      });
      return;
    }

    const clean = cleanProduct({ ...result.data, category: result.data.category ?? undefined });
    products.push({
      source: "BUSINESS_A",
      externalId: String(clean.id),
      title: clean.title,
      category: clean.category,
      price: Math.round(clean.price * 100) / 100,
    });
  });

  return { products, rejected };
}
