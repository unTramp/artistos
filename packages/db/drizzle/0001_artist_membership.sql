CREATE TABLE IF NOT EXISTS "artist_memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "auth_user_id" text NOT NULL,
  "role" text DEFAULT 'OWNER' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "artist_memberships_auth_user_uidx" ON "artist_memberships" ("auth_user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "artist_memberships_artist_user_uidx" ON "artist_memberships" ("artist_id", "auth_user_id");
