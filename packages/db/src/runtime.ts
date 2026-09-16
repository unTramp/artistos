import { sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Stage0Database = NodePgDatabase<typeof schema>;

export function createDatabase(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl, max: 10 });
  const db: Stage0Database = drizzle(pool, { schema });

  return {
    db,
    pool,
    async ping() {
      await db.execute(sql`select 1`);
    },
    async close() {
      await pool.end();
    }
  };
}
