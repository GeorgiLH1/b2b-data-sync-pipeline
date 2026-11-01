import { describe, it, expect } from "vitest";
import { parseBusinessAProducts } from "./business-a.js";

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

    const result = parseBusinessAProducts([goodRecordNoCategory]);

    expect(result.rejected).toEqual([]);
    expect(result.products[0]?.category).toBe("uncategorized");
  });

  it("uses uncategorized when the category is null", () => {
    const result = parseBusinessAProducts([{ ...goodRecord, category: null }]);

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

  it("keeps the good records when others in the batch are bad", () => {
    const result = parseBusinessAProducts([
      goodRecord,
      { id: 2 },
      null,
      "oops",
      { ...goodRecord, id: 4 },
    ]);

    expect(result.products.map((p) => p.externalId)).toEqual(["1", "4"]);
    expect(result.rejected.map((r) => r.index)).toEqual([1, 2, 3]);
    expect(result.rejected[2]?.externalId).toBeNull();
  });

  it("throws when the response is not a list", () => {
    expect(() => parseBusinessAProducts({ error: "nope" })).toThrow("not a list");
  });
});
