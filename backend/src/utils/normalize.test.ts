import { describe, it, expect } from "vitest";
import { norm, splitCsv } from "./normalize";

describe("norm", () => {
  it("trims whitespace", () => {
    expect(norm("  hello  ")).toBe("hello");
  });

  it("lowercases string", () => {
    expect(norm("React")).toBe("react");
  });

  it("handles empty string", () => {
    expect(norm("")).toBe("");
  });

  it("trims and lowercases combined", () => {
    expect(norm("  TypeScript  ")).toBe("typescript");
  });
});

describe("splitCsv", () => {
  it("returns empty array for undefined", () => {
    expect(splitCsv(undefined)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(splitCsv("")).toEqual([]);
  });

  it("splits comma-separated values", () => {
    expect(splitCsv("react,node,postgres")).toEqual([
      "react",
      "node",
      "postgres",
    ]);
  });

  it("trims and lowercases each value", () => {
    expect(splitCsv("  React , Node , PostgreSQL  ")).toEqual([
      "react",
      "node",
      "postgresql",
    ]);
  });

  it("filters out empty values from extra commas", () => {
    expect(splitCsv("react,,node")).toEqual(["react", "node"]);
  });

  it("handles single value", () => {
    expect(splitCsv("react")).toEqual(["react"]);
  });
});
