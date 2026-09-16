import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageAccessGrant, StorageObjectHead, StorageProvider } from "./index";

const assertOpaqueKey = (key: string) => {
  if (!/^[a-zA-Z0-9/_-]+$/.test(key) || key.includes("..") || key.startsWith("/")) {
    throw new Error("Invalid storage key");
  }
};

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly root: string) {}

  private resolve(key: string) {
    assertOpaqueKey(key);
    return path.join(this.root, key);
  }

  async put(key: string, data: Uint8Array) {
    const file = this.resolve(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, data);
  }

  async head(key: string): Promise<StorageObjectHead | null> {
    const file = this.resolve(key);
    try {
      const info = await stat(file);
      const data = await readFile(file);
      return {
        key,
        size: info.size,
        checksum: createHash("sha256").update(data).digest("hex")
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async delete(key: string) {
    await rm(this.resolve(key), { force: true });
  }

  async createAccessUrl(_key: string, _ttlSeconds: number): Promise<StorageAccessGrant> {
    throw new Error("Local storage does not expose public access URLs. Use an authenticated server delivery route in development.");
  }
}
