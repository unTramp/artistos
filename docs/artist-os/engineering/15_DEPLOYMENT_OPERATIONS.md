# Artist OS — Engineering Spec 15: Deployment & Operations

**Status:** DRAFT / Pass 1

## 1. Environments

```text
local
test/CI
staging
production
```

Environment config is explicit; production secrets never copied into local config files.

## 2. Deployable processes

```text
web
worker
postgres (managed/self-hosted)
object storage (provider)
```

Web and worker deploy from same application version/build artifact where practical to avoid schema/event drift.

## 3. Release order

Typical safe order:

```text
backup/check
→ backward-compatible DB migration
→ worker/web deploy
→ health/smoke
→ background backfill if needed
→ contract cleanup in later release
```

## 4. Configuration

Runtime configuration validated at startup. Missing critical DB/storage/security config fails readiness with actionable error. Missing optional provider config degrades that integration only.

## 5. Health/readiness

Web/worker expose process health. Worker health includes queue connectivity/heartbeat. DB readiness is required; AI/social/DSP providers are not required for core readiness.

## 6. Worker operations

Support graceful shutdown: stop claiming new jobs, finish/lease-release active jobs, preserve retry state.

## 7. Scheduled work

Periodic jobs (weekly review, freshness checks, cleanup) are enqueued by scheduler with idempotent schedule key. Scheduler itself does not execute business logic.

## 8. Database operations

Use connection pooling, query timeouts and monitored slow queries. Manual production DB edits are break-glass only and documented/audited.

## 9. Object storage operations

Lifecycle rules enforce temporary artifact expiry. Verify bucket/private ACL policy and signed URL configuration per environment.

## 10. Incident handling

For incident:

```text
detect
contain
preserve evidence
restore service
reconcile jobs/external effects
root cause
corrective action
```

Never “fix” publication/import duplication by deleting audit/provenance history.

## 11. Disaster recovery

Document DB restore, object-storage recovery assumptions, credential rotation and reconciliation of external platform state after restore.

## 12. Deployment gate

Production deploy requires:

```text
CI green
migration reviewed
backup status known
config validation
smoke plan
rollback class known
release notes for schema/provider changes
```

## 13. Acceptance criteria

- web and worker can be deployed/restarted independently;
- graceful worker shutdown does not lose jobs;
- optional provider outage does not fail core readiness;
- restore/reconciliation procedure is documented;
- production deploy has explicit rollback class.
