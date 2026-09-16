import { describe, expect, it } from "vitest";
import { parseRuntimeEnv } from "./env";

const required = {
  DATABASE_URL: "postgresql://artistos:artistos@localhost:5432/artistos",
  AUTH_SECRET: "stage0-test-secret-that-is-long-enough",
  AUTH_BASE_URL: "http://localhost:3000"
};

describe("parseRuntimeEnv", () => {
  it("boots core configuration with AI disabled by default", () => {
    const env = parseRuntimeEnv(required);
    expect(env.AI_PROVIDER).toBe("disabled");
    expect(env.ARTIST_OS_DEFAULT_TIMEZONE).toBe("UTC");
    expect(env.STORAGE_ROOT).toBe(".data/storage");
  });

  it("fails safely when required database/auth settings are missing", () => {
    expect(() => parseRuntimeEnv({ AUTH_SECRET: "too-short" })).toThrowError(/DATABASE_URL:|AUTH_SECRET:|AUTH_BASE_URL:/);
    try {
      parseRuntimeEnv({ AUTH_SECRET: "super-sensitive-secret-value" });
    } catch (error) {
      expect(String(error)).not.toContain("super-sensitive-secret-value");
    }
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() => parseRuntimeEnv({ ...required, DATABASE_URL: "https://example.test/database" })).toThrow("Invalid Artist OS runtime configuration");
  });
});
