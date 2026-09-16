import { createDatabase } from "@artist-os/db";
import { getRuntimeEnv } from "@artist-os/infrastructure";

const globalRuntime = globalThis as typeof globalThis & {
  __artistOsDatabase?: ReturnType<typeof createDatabase>;
};

export function getDatabaseRuntime() {
  const env = getRuntimeEnv();
  globalRuntime.__artistOsDatabase ??= createDatabase(env.DATABASE_URL);
  return globalRuntime.__artistOsDatabase;
}
