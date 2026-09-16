import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AIDisabledError, DisabledAIProvider } from "./index";

describe("DisabledAIProvider", () => {
  it("fails explicitly without requiring provider credentials", async () => {
    const provider = new DisabledAIProvider();

    await expect(provider.runStructured({
      workflow: "stage0-test",
      input: { value: 1 },
      outputSchema: z.object({ ok: z.boolean() }),
      traceId: "trace-stage0"
    })).rejects.toBeInstanceOf(AIDisabledError);
  });
});
