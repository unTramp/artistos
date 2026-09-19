import { eq } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { workspaceSettings } from "./schema";

export class PgWorkspaceSettingsReader {
  constructor(private readonly db: Stage0Database) {}

  async getLocale(artistId: string): Promise<string | null> {
    const [row] = await this.db
      .select({ locale: workspaceSettings.locale })
      .from(workspaceSettings)
      .where(eq(workspaceSettings.artistId, artistId))
      .limit(1);

    return row?.locale ?? null;
  }
}

export class PgWorkspaceSettingsWriter {
  constructor(private readonly db: Stage0Database) {}

  async updateLocale(artistId: string, locale: string): Promise<void> {
    await this.db
      .update(workspaceSettings)
      .set({ locale, updatedAt: new Date() })
      .where(eq(workspaceSettings.artistId, artistId));
  }
}
