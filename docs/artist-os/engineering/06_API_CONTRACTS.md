# Artist OS — Engineering Spec 06: API Contracts

**Status:** DRAFT / Pass 1
**Scope:** HTTP/server-action boundary for Web/PWA. Concrete route naming may adapt to Next.js conventions, but semantic contracts are normative.

## 1. API principles

### ENG-API-001 — Resource + command split
Use read endpoints for queries and explicit command endpoints/actions for lifecycle mutations. Avoid PATCH endpoints that can set arbitrary status fields and bypass business transitions.

### ENG-API-002 — Versioning
MVP internal web API uses `/api/v1`. Breaking external/integration-facing contracts require versioned adapter endpoints or migration window.

### ENG-API-003 — Standard response envelope

Success:

```json
{ "data": {}, "meta": { "traceId": "..." } }
```

Error:

```json
{
  "error": {
    "code": "CONTENT_INVALID_STATE",
    "message": "...",
    "fieldErrors": [],
    "retryable": false
  },
  "meta": { "traceId": "..." }
}
```

### ENG-API-004 — Pagination
List endpoints use cursor pagination by default:

```text
limit <= 100
cursor?
sort?
filters?
```

### ENG-API-005 — Idempotency header
External-effect commands accept `Idempotency-Key`.

### ENG-API-006 — Concurrency header
Editable roots return `ETag`/revision and accept `If-Match` or equivalent `expectedVersion` for mutation commands.

### ENG-API-007 — UTC transport
All persisted instants cross API as RFC3339 UTC. User-local schedule inputs include timezone where semantic local time matters.

### ENG-API-008 — Null semantics
Unavailable metrics/data serialize as `null`, never synthetic zero.

## 2. Core query endpoints

```text
GET /api/v1/overview
GET /api/v1/artist
GET /api/v1/identity
GET /api/v1/identity/versions
GET /api/v1/identity/eras
GET /api/v1/songs
GET /api/v1/songs/:songId
GET /api/v1/releases
GET /api/v1/releases/:releaseId
GET /api/v1/campaigns
GET /api/v1/campaigns/:campaignId
GET /api/v1/content/angles
GET /api/v1/content/units
GET /api/v1/content/units/:id
GET /api/v1/pipeline
GET /api/v1/calendar
GET /api/v1/shoots
GET /api/v1/shoots/:id
GET /api/v1/assets
GET /api/v1/assets/:id
GET /api/v1/publications
GET /api/v1/dsp/profiles
GET /api/v1/dsp/releases/:releaseId
GET /api/v1/growth/markets
GET /api/v1/business/offers
GET /api/v1/analytics/summary
GET /api/v1/experiments
GET /api/v1/learnings
GET /api/v1/decisions
GET /api/v1/knowledge
GET /api/v1/research/claims
GET /api/v1/agents/runs
GET /api/v1/jobs/:jobId
```

## 3. Representative command endpoints

### Identity

```text
POST /api/v1/identity/versions
POST /api/v1/identity/versions/:id/submit
POST /api/v1/identity/versions/:id/activate
POST /api/v1/identity/checks
POST /api/v1/identity/deviations
POST /api/v1/identity/brand-book/generate
```

### Songs / Releases

```text
POST /api/v1/songs
POST /api/v1/songs/:id/segments
POST /api/v1/releases
POST /api/v1/releases/:id/schedule
POST /api/v1/releases/:id/delay
```

### Content

```text
POST /api/v1/content/angles/generate
POST /api/v1/content/angles/:id/approve
POST /api/v1/content/angles/:id/reject
POST /api/v1/content/angles/:id/create-unit
POST /api/v1/content/units/:id/transition
POST /api/v1/content/units/:id/novelty-check
```

### Planning

```text
POST /api/v1/planning/objectives
POST /api/v1/planning/objectives/:id/activate
POST /api/v1/planning/objectives/:id/complete
POST /api/v1/calendar/slots
```

### Production / Assets

```text
POST /api/v1/shoots
POST /api/v1/shoots/:id/shots
POST /api/v1/shots/:id/takes/start
POST /api/v1/takes/:id/close
POST /api/v1/takes/:id/select
POST /api/v1/assets/upload-init
POST /api/v1/assets/upload-complete
POST /api/v1/assets/smart-ingest
POST /api/v1/assets/:id/rights
POST /api/v1/assets/rights/evaluate
POST /api/v1/assets/derivations
```

### Distribution / DSP

```text
POST /api/v1/publications
POST /api/v1/publications/:id/schedule
POST /api/v1/publications/:id/reconcile
POST /api/v1/link-hubs/:id/publish
POST /api/v1/web-experiences/:id/publish
POST /api/v1/dsp/releases/:releaseId/plans
POST /api/v1/dsp/editorial-pitches/:id/submit
```

### Analytics / Intelligence

```text
POST /api/v1/imports/metrics
POST /api/v1/imports/:id/confirm
POST /api/v1/insights
POST /api/v1/hypotheses
POST /api/v1/experiments
POST /api/v1/experiments/:id/start
POST /api/v1/experiments/:id/complete
POST /api/v1/learnings/:id/promote
POST /api/v1/decisions
POST /api/v1/weekly-reviews/generate
```

### Knowledge / AI

```text
POST /api/v1/knowledge/candidates/:id/promote
POST /api/v1/research/claims/:id/verify
POST /api/v1/context/assemble                 # debug/admin surface; not generic agent bypass
POST /api/v1/agents/run
POST /api/v1/agents/runs/:id/cancel
```

## 4. Upload contract

### ENG-API-009 — Direct-to-storage upload
Large media should use signed/direct upload:

```text
1 POST upload-init → uploadId + signed target
2 client uploads binary directly
3 POST upload-complete → checksum/metadata
4 Asset registered
5 async analysis job starts
```

Server application process should not proxy multi-GB media in normal production flow.

### ENG-API-010 — Integrity
Upload complete requires size/checksum/object existence validation before Asset becomes `AVAILABLE`.

## 5. Async operation contract

Long-running command may return:

```json
{
  "data": {
    "operation": "JOB",
    "jobId": "...",
    "status": "QUEUED"
  }
}
```

Client polls/subscribes to job status. The domain command outcome remains distinct from worker progress.

## 6. Import preview contract

CSV/import APIs support:

```text
upload
→ detect schema
→ return proposed mapping
→ preview rows + validation errors
→ user confirm mapping
→ enqueue import
```

No import writes canonical metric/revenue rows before confirmation unless source adapter has a previously approved reusable mapping template.

## 7. Security contracts

### ENG-API-011 — No secret echo
Provider tokens/secrets are write-only; GET endpoints return masked connection state, never secret value.

### ENG-API-012 — Internal canon filtering
External/provider-bound endpoints receive only fields explicitly selected by application service. Full Artist Brain/private narrative is never serialized wholesale into integration payloads.

### ENG-API-013 — Audit-sensitive reason
Rights override, protected identity deviation, destructive archival and similar commands require a non-empty reason field when policy says so.

## 8. Web/PWA offline contracts

On-Set local actions use client-generated UUID command IDs and monotonically increasing local sequence numbers. Sync endpoint accepts batches and returns per-command outcomes:

```text
APPLIED
ALREADY_APPLIED
CONFLICT
REJECTED
```

Conflict resolution never fabricates Take/Asset lineage.

## 9. Acceptance criteria

- Status changes use explicit command endpoints, not generic field patching.
- All external-effect APIs support idempotency.
- Large media bypasses app server binary proxy in production design.
- Null metric semantics preserved.
- PWA On-Set sync is replay-safe.
- ACP-dependent routes are visibly provisional.
