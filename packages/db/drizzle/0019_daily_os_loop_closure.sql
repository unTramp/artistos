ALTER TABLE "planning_objectives"
  ADD COLUMN "related_refs" jsonb DEFAULT '[]'::jsonb NOT NULL;
