import { eq, sql } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { consumerInbox, outboxEvents } from "./schema";

export interface ConsumedOutboxEvent {
  id: string;
  eventType: string;
  artistId: string;
  correlationId: string;
  payload: unknown;
  duplicate: boolean;
}

export class PgOutboxConsumer {
  constructor(private readonly db: Stage0Database) {}

  async consumeNext(consumer: string): Promise<ConsumedOutboxEvent | null> {
    return this.db.transaction(async (tx) => {
      const selected = await tx.execute(sql`
        SELECT id, event_type, artist_id, correlation_id, payload
        FROM outbox_events
        WHERE published_at IS NULL
        ORDER BY recorded_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      `);

      const row = selected.rows[0] as
        | { id: string; event_type: string; artist_id: string; correlation_id: string; payload: unknown }
        | undefined;

      if (!row) return null;

      const inserted = await tx.insert(consumerInbox).values({
        consumer,
        eventId: row.id
      }).onConflictDoNothing().returning({ id: consumerInbox.id });

      await tx.update(outboxEvents)
        .set({ publishedAt: new Date() })
        .where(eq(outboxEvents.id, row.id));

      return {
        id: row.id,
        eventType: row.event_type,
        artistId: row.artist_id,
        correlationId: row.correlation_id,
        payload: row.payload,
        duplicate: inserted.length === 0
      };
    });
  }
}
