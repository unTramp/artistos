import { and, eq } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { idempotencyRecords } from "./schema";

export type IdempotencyClaim<T> =
  | { status: "CLAIMED"; recordId: string }
  | { status: "REPLAY"; result: T }
  | { status: "IN_PROGRESS" };

export class PgRequestIdempotency {
  constructor(private readonly db: Stage0Database) {}

  async claim<T>(input: {
    scope: string;
    key: string;
    commandName: string;
    artistId: string;
    now: Date;
  }): Promise<IdempotencyClaim<T>> {
    const [claim] = await this.db.insert(idempotencyRecords).values({
      scope: input.scope,
      key: input.key,
      commandName: input.commandName,
      artistId: input.artistId,
      status: "IN_PROGRESS",
      createdAt: input.now,
      updatedAt: input.now
    }).onConflictDoNothing().returning({ id: idempotencyRecords.id });
    if (claim) return { status: "CLAIMED", recordId: claim.id };

    const [existing] = await this.db.select({ status: idempotencyRecords.status, result: idempotencyRecords.result })
      .from(idempotencyRecords)
      .where(and(eq(idempotencyRecords.scope, input.scope), eq(idempotencyRecords.key, input.key)))
      .limit(1);
    if (existing?.status === "SUCCESS" && existing.result !== null) return { status: "REPLAY", result: existing.result as T };
    return { status: "IN_PROGRESS" };
  }

  async complete(recordId: string, result: unknown, now: Date): Promise<void> {
    await this.db.update(idempotencyRecords).set({
      status: "SUCCESS",
      result: result as Record<string, unknown>,
      updatedAt: now
    }).where(eq(idempotencyRecords.id, recordId));
  }
}
