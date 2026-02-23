import { describe, it, expect } from "vitest";
import { HttpError } from "./http";

describe("HttpError", () => {
  it("creates error with statusCode and message", () => {
    const err = new HttpError(404, "Not found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
    expect(err.details).toBeUndefined();
  });

  it("creates error with details", () => {
    const details = { field: "email", issue: "invalid" };
    const err = new HttpError(400, "Validation error", details);
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual(details);
  });

  it("is instanceof Error", () => {
    const err = new HttpError(500, "Server error");
    expect(err).toBeInstanceOf(Error);
  });

  it("is instanceof HttpError", () => {
    const err = new HttpError(403, "Forbidden");
    expect(err).toBeInstanceOf(HttpError);
  });
});
