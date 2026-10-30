import { describe, it, expect } from "vitest";
import { parseBusinessAProducts } from "./business-a.js";
import { parse } from "node:path";

const goodRecord = {
  id: 1,
  title: "  Fjallraven Backpack ",
  price: 109.95,
  description: "ignored",
  category: "Men's Clothing",
  image: "https://example.com/x.png",
};

describe("parseBusinessAProducts", () => {
  it("accepts a valid record and cleans it", () => {
    const result = parseBusinessAProducts([goodRecord]);

    expect(result.rejected).toEqual([]);
    expect(result.products).toEqual([
      {
        source: "BUSINESS_A",
        externalId: "1",
        title: "Fjallraven Backpack",
        category: "men's clothing",
        price: 109.95,
      },
    ]);
  });

  it("uses uncategorized when the category is missing", () => {
    const { category: _category, ...goodRecordNoCategory } = goodRecord;

    const result = parseBusinessAProducts([{ ...goodRecord, category: undefined }]);

    expect(result.rejected).toEqual([]);
    expect(result.products[0]?.category).toBe("uncategorized");
  });

  it("rejects a record with an empty title", () => {
    const result = parseBusinessAProducts([{ ...goodRecord, title: "   " }]);

    expect(result.products).toEqual([]);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]?.index).toBe(0);
    expect(result.rejected[0]?.externalId).toBe("1");
    expect(result.rejected[0]?.reasons.join(" ")).toContain("title");
  });

  it("rejects a negative price and a text price", () => {
    const result = parseBusinessAProducts([
      { ...goodRecord, price: -5 },
      { ...goodRecord, id: 2, price: "cheap" },
    ]);

    expect(result.products).toEqual([]);
    expect(result.rejected).toHaveLength(2);
    expect(result.rejected[0]?.reasons.join(" ")).toContain("price");
    expect(result.rejected[1]?.reasons.join(" ")).toContain("price");
  });
});
