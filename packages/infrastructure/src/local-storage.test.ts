import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocalStorageProvider } from "./local-storage";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

async function storageFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "artist-os-storage-"));
  roots.push(root);
  return new LocalStorageProvider(root);
}

describe("LocalStorageProvider", () => {
  it("stores private bytes and reports checksum metadata", async () => {
    const storage = await storageFixture();
    await storage.put("artist/test-object", new TextEncoder().encode("hello"));
    const head = await storage.head("artist/test-object");
    expect(head).toMatchObject({ key: "artist/test-object", size: 5 });
    expect(head?.checksum).toHaveLength(64);
  });

  it("deletes objects without inventing public identity", async () => {
    const storage = await storageFixture();
    await storage.put("opaque/object-id", new TextEncoder().encode("private"));
    await storage.delete("opaque/object-id");
    await expect(storage.head("opaque/object-id")).resolves.toBeNull();
  });

  it("rejects traversal keys", async () => {
    const storage = await storageFixture();
    await expect(storage.put("../escape", new Uint8Array())).rejects.toThrow("Invalid storage key");
    await expect(storage.put("/absolute", new Uint8Array())).rejects.toThrow("Invalid storage key");
  });

  it("does not expose a public development URL", async () => {
    const storage = await storageFixture();
    await storage.put("opaque/private-object", new TextEncoder().encode("private"));
    await expect(storage.createAccessUrl("opaque/private-object", 60)).rejects.toThrow("does not expose public access URLs");
  });
});
