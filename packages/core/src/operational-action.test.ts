import { describe, expect, it } from "vitest";
import {
  BlockOperationalActionService,
  CompleteOperationalActionService,
  CreateOperationalActionService,
  ReopenOperationalActionService,
  StartOperationalActionService,
  type OperationalActionResult,
  type OperationalActionWritePort
} from "./operational-action";
import type { CommandContext } from "./index";

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId: crypto.randomUUID(),
  actor: { type: "USER", id: "user-1" },
  requestedAt: new Date("2026-09-17T00:00:00.000Z"),
  traceId: "trace-1",
  ...overrides
});

const result = (status: OperationalActionResult["status"], version = 1): OperationalActionResult => ({
  actionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  status,
  version,
  completedAt: status === "DONE" ? new Date("2026-09-17T00:00:00.000Z") : null
});

class StubWriter implements OperationalActionWritePort {
  public lastTransition: Parameters<OperationalActionWritePort["transitionAction"]>[0] | null = null;
  async createAction(): Promise<OperationalActionResult> { return result("OPEN"); }
  async transitionAction(request: Parameters<OperationalActionWritePort["transitionAction"]>[0]): Promise<OperationalActionResult> {
    this.lastTransition = request;
    return result(request.toStatus, 2);
  }
}

describe("OperationalAction application contract", () => {
  it("creates canonical OPEN action with normalized default priority", async () => {
    const writer = new StubWriter();
    const service = new CreateOperationalActionService(writer, () => "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    const created = await service.execute({
      sourceDomain: "DSP",
      sourceEntityType: "EditorialPitch",
      sourceEntityId: "pitch-1",
      title: "Submit Spotify editorial pitch",
      actionType: "SUBMIT_EDITORIAL_PITCH",
      executionMode: "EXTERNAL"
    }, context());
    expect(created).toMatchObject({ status: "SUCCESS", data: { status: "OPEN" } });
  });

  it("maps explicit lifecycle commands to canonical states", async () => {
    const writer = new StubWriter();
    const actionId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    await new StartOperationalActionService(writer).execute({ actionId }, context());
    expect(writer.lastTransition?.toStatus).toBe("IN_PROGRESS");
    await new BlockOperationalActionService(writer).execute({ actionId, reason: "Artwork is missing." }, context());
    expect(writer.lastTransition).toMatchObject({ toStatus: "BLOCKED", reason: "Artwork is missing." });
    await new ReopenOperationalActionService(writer).execute({ actionId, reason: "Artwork is now available." }, context());
    expect(writer.lastTransition).toMatchObject({ toStatus: "OPEN", reason: "Artwork is now available." });
  });

  it("allows USER confirmation to complete without external evidence", async () => {
    const writer = new StubWriter();
    const completed = await new CompleteOperationalActionService(writer).execute({ actionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }, context());
    expect(completed).toMatchObject({ status: "SUCCESS", data: { status: "DONE" } });
  });

  it("requires verifiable evidence for non-user completion", async () => {
    const writer = new StubWriter();
    const actionId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const blocked = await new CompleteOperationalActionService(writer).execute({ actionId }, context({ actor: { type: "INTEGRATION", id: "spotify" } }));
    expect(blocked).toMatchObject({ status: "BLOCKED", code: "OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED" });

    const completed = await new CompleteOperationalActionService(writer).execute({ actionId, evidenceRef: "provider-event:123" }, context({ actor: { type: "INTEGRATION", id: "spotify" } }));
    expect(completed).toMatchObject({ status: "SUCCESS", data: { status: "DONE" } });
  });
});
