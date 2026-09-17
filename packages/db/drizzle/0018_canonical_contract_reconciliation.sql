ALTER TABLE "planning_objectives" ADD COLUMN "status" text DEFAULT 'ACTIVE' NOT NULL;
ALTER TABLE "planning_objectives" ADD COLUMN "success_criteria" jsonb DEFAULT '[]'::jsonb NOT NULL;

UPDATE "planning_objectives"
SET "status" = 'COMPLETED'
WHERE "completed_at" IS NOT NULL;

DROP INDEX IF EXISTS "planning_objectives_artist_priority_idx";
CREATE INDEX "planning_objectives_artist_priority_idx" ON "planning_objectives" USING btree ("artist_id","priority","status");
CREATE INDEX "planning_objectives_artist_status_idx" ON "planning_objectives" USING btree ("artist_id","status","updated_at");
