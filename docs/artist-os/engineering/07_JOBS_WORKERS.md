# Artist OS — Engineering Spec 07: Jobs & Workers

**Status:** DRAFT / Pass 1

## 1. Purpose

Define durable asynchronous execution for long-running, retryable and provider-bound work without hiding domain state inside queue implementation.

## 2. Job model

### ENG-JOB-001 — Canonical Job record

```text
Job
id
artistId?
type
status: QUEUED|RUNNING|SUCCEEDED|FAILED|CANCELLED|DEAD_LETTER
priority
payloadVersion
payloadRef/payload
idempotencyKey
attemptCount
maxAttempts
nextAttemptAt?
lockedAt?
lockedBy?
progressPhase?
progressPercent?
lastErrorCode?
lastErrorMessageSafe?
correlationId
causationId?
createdAt
startedAt?
finishedAt?
```

Queue implementation may be PostgreSQL-backed in MVP.

### ENG-JOB-002 — Job is execution, not business truth
A successful job does not itself mean a domain operation is valid; worker invokes application services/commands which enforce current rules.

### ENG-JOB-003 — At-least-once safe
Every handler must tolerate duplicate execution. Handler declares idempotency strategy.

### ENG-JOB-004 — Leasing
Workers claim jobs with lease/heartbeat semantics. Expired leases return eligible jobs to queue without duplicating committed external effects.

### ENG-JOB-005 — Retry policy
Each type declares retryable error classes, exponential/backoff policy, max attempts and dead-letter behavior.

### ENG-JOB-006 — Cancellation
Cancellation is cooperative. `CANCELLED` means worker observed cancellation before irreversible side effect or completed compensating logic. External effects already completed are reconciled, not erased.

## 3. Job catalog

MASTER core jobs:

```text
TRANSCRIBE_ASSET
ANALYZE_ASSET
GENERATE_EMBEDDINGS
IMPORT_ANALYTICS
REFRESH_PLATFORM_DATA
WEEKLY_REVIEW
RUN_AGENT
GENERATE_PREVIEW
SMART_INGEST
ANALYZE_MOODBOARD
EXTRACT_VISUAL_PATTERNS
GENERATE_BRAND_BOOK
IDENTITY_CHECK
```

Additional engineering jobs allowed as implementation detail:

```text
REBUILD_PROJECTION
RECONCILE_PUBLICATION
PURGE_EXPIRED_DEBUG_PAYLOADS
VERIFY_STORAGE_OBJECT
REFRESH_RESEARCH_FRESHNESS
```

They must not create new product behavior silently.

## 4. Handler requirements

### ENG-JOB-007 — Versioned payload
Handler accepts explicit payloadVersion and migrates/rejects unsupported old payloads deterministically.

### ENG-JOB-008 — Check current state
Before work, handler reloads current entity state. Example: a queued Brand Book job for an archived Identity Version can be cancelled/skipped instead of publishing stale output.

### ENG-JOB-009 — Provider timeout
Every external provider call has timeout + retry classification. Infinite provider wait is forbidden.

### ENG-JOB-010 — Progress
Long jobs emit coarse product-safe phases only, e.g. `Researching`, `Analyzing`, `Generating`, `Quality Check`. Do not expose model chain-of-thought.

### ENG-JOB-011 — Partial artifacts
Temporary/intermediate files are stored with expiration and are not surfaced as canonical Assets until validation/registration succeeds.

## 5. Idempotency patterns

- transcription: `(assetId, providerConfigVersion, audioRevision)`
- embeddings: `(sourceVersionId, embeddingModelVersion)`
- analytics import: `(importBatchId, mappingVersion)`
- agent run: explicit AgentRun id; retry creates attempt under same logical run unless product asks for a new run
- preview: `(sourceAssetVersion, previewProfileVersion)`
- identity check: `(targetRevision, identityVersionId, guardVersion)`

## 6. Outbox/inbox

### ENG-JOB-012 — Transactional outbox
Cross-domain/job events generated in the same DB mutation are appended transactionally.

### ENG-JOB-013 — Consumer inbox
Critical consumers store processed `eventId` or equivalent to prevent duplicate effect.

## 7. Dead letter and recovery

Dead-letter UI/API exposes:

```text
job type
entity reference
safe error
attempts
last attempt
retry eligibility
recommended recovery
```

Manual retry creates audit/telemetry. Secrets/provider raw payloads are not shown.

## 8. Concurrency control

### ENG-JOB-014 — Per-entity mutual exclusion when necessary
Examples: two simultaneous imports for same exact file; two Brand Book generations for same identity revision; duplicate publication reconciliation. Use advisory locks/unique active-job keys rather than global serialization.

### ENG-JOB-015 — Bounded worker concurrency
Provider-specific concurrency/rate limits are configuration, not hardcoded domain constants.

## 9. Retention

Job execution metadata retained long enough for debugging/audit/cost analysis. Large request/response/debug payloads use shorter configurable retention, especially if they contain private canon.

## 10. Acceptance criteria

- killing a worker does not lose queued work;
- duplicate delivery does not duplicate external publication/import records;
- every job has max attempts and dead-letter path;
- product UI can show coarse progress without exposing hidden reasoning;
- jobs do not bypass application command validation.
