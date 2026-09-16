CREATE UNIQUE INDEX "jobs_type_idempotency_uidx" ON "jobs" ("type", "idempotency_key");
