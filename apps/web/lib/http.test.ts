import { describe, expect, it } from "vitest";
import { apiErrorResponse, getTraceId, successResponse } from "./http";

describe("Stage 0 HTTP boundary", () => {
  it("preserves an incoming trace id", () => {
    const headers = new Headers({ "x-trace-id": "trace-incoming" });
    expect(getTraceId(headers)).toBe("trace-incoming");
  });

  it("returns trace metadata and response header", async () => {
    const response = successResponse({ ok: true }, "trace-success", 201);
    expect(response.status).toBe(201);
    expect(response.headers.get("x-trace-id")).toBe("trace-success");
    await expect(response.json()).resolves.toEqual({ data: { ok: true }, meta: { traceId: "trace-success" } });
  });

  it("returns a safe structured error envelope", async () => {
    const response = apiErrorResponse(
      { code: "TEST_FAILURE", message: "Safe failure", retryable: false },
      "trace-error",
      400
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: { code: "TEST_FAILURE", message: "Safe failure", retryable: false },
      meta: { traceId: "trace-error" }
    });
  });
});
