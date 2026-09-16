# Artist OS — Engineering Spec 10: Integrations

**Status:** DRAFT / Pass 1

## 1. Purpose
Define provider/adaptor boundaries for platforms, publishing, analytics imports, transcription, storage, AI and owned-media services without leaking provider semantics into domain ownership.

## 2. Adapter contracts

### ENG-INT-001 — Provider identity
Every adapter declares `providerKey`, config version, supported capabilities, auth mode, regions/account constraints and health state.

### ENG-INT-002 — Capability registry first
Application checks PlatformCapability/PlatformAccountProfile before presenting or invoking provider functionality. Provider SDK availability is not equivalent to user eligibility.

### ENG-INT-003 — External IDs
Store provider-specific IDs in adapter-owned reference records linked to canonical entities. Do not replace canonical UUIDs with provider IDs.

### ENG-INT-004 — Manual/CSV parity
Where API access is unavailable or unreliable, manual/CSV path remains first-class if product spec requires the workflow.

### ENG-INT-005 — Provider payload isolation
Raw provider payloads may be retained as evidence/debug under retention policy, but domain code consumes normalized adapter DTOs.

## 3. Provider interfaces

```text
AIProvider
TranscriptionProvider
EmbeddingProvider
StorageProvider
QueueProvider
PlatformProvider
PublishingProvider
AnalyticsImportProvider
AudienceCaptureProvider
```

Each provider supports explicit timeout/error classification and observability hooks.

## 4. Platform adapters

### ENG-INT-006 — Social/platform account connection
Connection record includes canonical platform/account ref, connection status, granted scopes, capability snapshot, last refresh and token reference (never token value in domain row).

### ENG-INT-007 — Publishing reconciliation
Publishing adapter returns externalContentId/url/status when available. Retry/reconcile by idempotency key/external ID before creating another post.

### ENG-INT-008 — Analytics imports
Adapter maps provider fields to canonical metric schema with source-field provenance. Unsupported canonical metrics remain NULL.

### ENG-INT-009 — Freshness
Capability/eligibility observations carry source and verifiedAt/fresh-until semantics; stale data is surfaced as stale, not silently treated current.

## 5. DSP adapters

Separate adapters/read models for:

```text
catalog/profile metadata
release opportunities/readiness evidence
source-of-streams/performance exports
royalty statements
```

Do not merge royalties and streaming performance into one generic importer.

## 6. OAuth / credentials

Tokens are stored encrypted server-side through credential vault abstraction. Refresh is worker/server-only. Scope changes and reconnects create audit events.

## 7. Rate limiting

Per-provider rate limits use configurable limiter keyed by provider/account. Backoff honors provider retry headers where available.

## 8. Webhooks

Webhook endpoints:
- verify signature/secret;
- persist receipt ID and deduplicate;
- acknowledge quickly;
- enqueue processing;
- never trust payload without account/entity validation.

## 9. Import mapping templates

CSV mapping template is versioned per source/export signature. User-confirmed mapping can be reused; schema drift triggers re-preview rather than silent mis-import.

## 10. Audience capture boundary

Owned-media provider integration stores aggregate conversion metrics + provider/form/campaign refs. Person-level contacts remain provider-owned until explicit CRM scope.

## 11. Acceptance criteria

- no provider SDK imported by domain package;
- provider outage degrades only dependent workflows;
- external IDs never become canonical IDs;
- CSV/manual fallback works where promised;
- stale capability information is visible;
- webhook processing is replay-safe.
