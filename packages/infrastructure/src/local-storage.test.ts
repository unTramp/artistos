import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocalStorageProvider } from "./local-storage";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

describe("LocalStorageProvider", () => {
  it("stores private bytes and reports checksum metadata", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "artist-os-storage-"));
    roots.push(root);
    const storage = new LocalStorageProvider(root);
    await storage.put("artist/test-object", new TextEncoder().encode("hello"));
    const head = await storage.head("artist/test-object");
    expect(head?.size).toBe(5);
    expect(head?.checksum).toHaveLength(64);
  });

  it("rejects traversal keys", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "artist-os-storage-"));
    roots.push(root);
    const storage = new LocalStorageProvider(root);
    await expect(storage.put("../escape", new Uint8Array())).rejects.toThrow("Invalid storage key");
  });
});
