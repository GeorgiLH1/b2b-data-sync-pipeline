import { describe, it, expect } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("uses defaults when nothing is set", () => {
    expect(loadConfig({})).toEqual({ NODE_ENV: "development", PORT: 3000 });
  });

  it("reads PORT from text and converts it to a number", () => {
    expect(loadConfig({ PORT: "4000" }).PORT).toBe(4000);
  });

  for (const badPort of ["abc", "30.5", "-5", "0", "70000"]) {
    it(`throws when PORT is ${badPort}`, () => {
      expect(() => loadConfig({ PORT: "abc" })).toThrow("PORT");
    });
  }

  it("throws when node is not one of the enum values", () => {
    expect(() => loadConfig({ NODE_ENV: "banana" })).toThrow("NODE_ENV");
  });

  it("accepts the lowest and highest valid ports", () => {
    expect(loadConfig({ PORT: "1" }).PORT).toBe(1);
    expect(loadConfig({ PORT: "65535" }).PORT).toBe(65535);
  });
});
