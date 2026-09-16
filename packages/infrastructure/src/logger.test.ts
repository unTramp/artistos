import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { createLogger } from "./index";

describe("createLogger", () => {
  it("emits structured service context and redacts credential fields", async () => {
    const stream = new PassThrough();
    const outputPromise = new Promise<string>((resolve) => {
      stream.once("data", (chunk) => resolve(chunk.toString()));
    });

    const logger = createLogger({ service: "stage0-test", destination: stream });
    logger.error({
      operation: "security.redaction_test",
      traceId: "trace-test",
      password: "root-password",
      auth: { token: "nested-token", secret: "nested-secret" },
      req: { headers: { authorization: "Bearer private-token" } }
    }, "safe message");

    const output = await outputPromise;
    const record = JSON.parse(output.trim()) as Record<string, unknown>;
    expect(record).toMatchObject({
      service: "stage0-test",
      operation: "security.redaction_test",
      traceId: "trace-test",
      password: "[REDACTED]",
      auth: { token: "[REDACTED]", secret: "[REDACTED]" },
      req: { headers: { authorization: "[REDACTED]" } },
      msg: "safe message"
    });
    expect(output).not.toContain("root-password");
    expect(output).not.toContain("nested-token");
    expect(output).not.toContain("nested-secret");
    expect(output).not.toContain("Bearer private-token");
  });
});
