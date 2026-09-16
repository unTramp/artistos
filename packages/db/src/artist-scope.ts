import { eq } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { artistMemberships } from "./schema";

export class PgArtistScopeReader {
  constructor(private readonly db: Stage0Database) {}

  async findArtistIdByAuthUserId(authUserId: string): Promise<string | null> {
    const [membership] = await this.db
      .select({ artistId: artistMemberships.artistId })
      .from(artistMemberships)
      .where(eq(artistMemberships.authUserId, authUserId))
      .limit(1);

    return membership?.artistId ?? null;
  }
}
