import { describe, it, expect } from "vitest";
import { loadConfig } from "./config.js";

const validEnv = { DATABASE_URL: "postgresql://user:pw@localhost:5432/db" };

describe("loadConfig", () => {
  it("uses defaults when only DATABASE_URL is set", () => {
    expect(loadConfig(validEnv)).toEqual({
      NODE_ENV: "development",
      PORT: 3000,
      DATABASE_URL: validEnv.DATABASE_URL,
    });
  });

  it("reads PORT from text and converts it to a number", () => {
    expect(loadConfig({ ...validEnv, PORT: "4000" }).PORT).toBe(4000);
  });

  for (const badPort of ["abc", "30.5", "-5", "0", "70000"]) {
    it(`throws when PORT is "${badPort}"`, () => {
      expect(() => loadConfig({ ...validEnv, PORT: badPort })).toThrow("PORT");
    });
  }

  it("throws when DATABASE_URL is missing", () => {
    expect(() => loadConfig({})).toThrow("DATABASE_URL");
  });

  it("throws when DATABASE_URL is not a postgresql url", () => {
    expect(() => loadConfig({ DATABASE_URL: "mysql://x" })).toThrow("DATABASE_URL");
  });

  it("throws when NODE_ENV is not an allowed value", () => {
    expect(() => loadConfig({ ...validEnv, NODE_ENV: "banana" })).toThrow("NODE_ENV");
  });

  it("accepts the lowest and highest valid ports", () => {
    expect(loadConfig({ ...validEnv, PORT: "1" }).PORT).toBe(1);
    expect(loadConfig({ ...validEnv, PORT: "65535" }).PORT).toBe(65535);
  });
});
