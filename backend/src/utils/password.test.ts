import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("returns a hash different from the original password", async () => {
    const hash = await hashPassword("mypassword");
    expect(hash).not.toBe("mypassword");
  });

  it("returns a bcrypt hash (starts with $2b$)", async () => {
    const hash = await hashPassword("testpass");
    expect(hash.startsWith("$2b$")).toBe(true);
  });

  it("produces different hashes for same password (salt)", async () => {
    const hash1 = await hashPassword("password123");
    const hash2 = await hashPassword("password123");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("correctpass");
    const result = await verifyPassword("correctpass", hash);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("correctpass");
    const result = await verifyPassword("wrongpass", hash);
    expect(result).toBe(false);
  });

  it("returns false for empty string when hash is from non-empty", async () => {
    const hash = await hashPassword("somepassword");
    const result = await verifyPassword("", hash);
    expect(result).toBe(false);
  });
});
