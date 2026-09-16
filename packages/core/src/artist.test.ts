import { describe, expect, it } from "vitest";
import { CreateArtistService, type ArtistWorkspaceWritePort } from "./artist";

const fixedDate = new Date("2026-09-16T10:00:00.000Z");

describe("CreateArtistService", () => {
  it("creates event/audit evidence through the persistence port", async () => {
    const calls: unknown[] = [];
    const writer: ArtistWorkspaceWritePort = {
      async createArtistWorkspace(request) {
        calls.push(request);
        return { artistId: request.artist.id, workspaceSettingsId: "workspace-1", replayed: false };
      }
    };
    let id = 0;
    const service = new CreateArtistService(writer, () => fixedDate, () => `id-${++id}`);

    const result = await service.execute(
      { name: "Andrey Dorofeev", artistName: "Andrey Dorofeev", timezone: "Asia/Yerevan" },
      {
        commandId: "command-1",
        artistId: "artist-1",
        actor: { type: "USER", id: "user-1" },
        requestedAt: fixedDate,
        traceId: "trace-1",
        idempotencyKey: "idem-1"
      }
    );

    expect(result.status).toBe("SUCCESS");
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      artist: { id: "artist-1", timezone: "Asia/Yerevan" },
      event: { eventType: "ArtistCreated", correlationId: "trace-1", causationId: "command-1" },
      audit: { action: "ARTIST_CREATED", traceId: "trace-1" },
      idempotencyKey: "idem-1"
    });
  });

  it("rejects an invalid timezone before persistence", async () => {
    const writer: ArtistWorkspaceWritePort = {
      async createArtistWorkspace() {
        throw new Error("must not be called");
      }
    };
    const service = new CreateArtistService(writer, () => fixedDate, () => "id-1");
    const result = await service.execute(
      { name: "Artist", artistName: "Artist", timezone: "Mars/Olympus" },
      { commandId: "c", artistId: "a", actor: { type: "USER" }, requestedAt: fixedDate, traceId: "t" }
    );
    expect(result.status).toBe("VALIDATION_ERROR");
  });
});
