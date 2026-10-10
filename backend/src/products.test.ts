import { describe, it, expect } from "vitest";
import { isValid, cleanProduct } from "./products.js";

describe("isValid", () => {
  it("accepts a normal product", () => {
    expect(isValid({ id: 1, title: "Notebook", price: 3.2 })).toBe(true);
  });
  it("rejects an empty title", () => {
    expect(isValid({ id: 5, title: "", price: 4, category: "213"})).toBe(false);
  });
  it("rejects a negative price", () => {
    expect(isValid({id: 1, title: "Awdasd", price: -5})).toBe(false);
  });
  it("rejects a title of only spaces", () => {
    expect(isValid({id: 1, title: "     ", price: 5})).toBe(false);
  });
  it("accepts a title with spaces around real text", () => {
    expect(isValid({id: 1, title: " wasd ", price: 5})).toBe(true);
  });
});

describe("cleanProduct", () =>{
    it("trims the title and lowercaes the category", () => {
        expect(
            cleanProduct({id: 1, title: " Mouse ", price: 25.5, category: "ELECTRONICS"})
        ).toEqual({id: 1, title: "Mouse", price: 25.5, category: "electronics"});
    });
    it("uses 'uncategorized' when there is no category", () => {
        expect(
            cleanProduct({id: 1, title: "Notebook", price: 3.2})
        ).toEqual({id: 1, title: "Notebook", price: 3.2, category: "uncategorized"});
    });
});
