import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "./runtime";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for migrations");

const runtime = createDatabase(databaseUrl);
try {
  await migrate(runtime.db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
} finally {
  await runtime.close();
}
