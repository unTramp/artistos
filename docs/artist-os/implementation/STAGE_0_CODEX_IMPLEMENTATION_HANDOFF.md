# Artist OS — Stage 0 Codex Implementation Handoff

**Status:** IMPLEMENTATION HANDOFF / Stage 0
**Architecture baseline:** frozen `MASTER_ARCHITECTURE_v1.4.md` + AR-001…AR-062
**Product baseline:** Full Product Spec Pass 1 — 181 feature specs / 2,334 stable product requirements
**Engineering baseline:** Engineering Specification Pass 1 + v1.4 consistency/post-freeze cleanup
**Repository state before Stage 0:** documentation-only; no application runtime exists yet

## 1. Mission

Create the production-capable technical foundation for Artist OS without prematurely implementing the full product.

Stage 0 must prove that the architecture is executable as a modular monolith and establish the contracts every later vertical slice will reuse.

The target system is:

```text
Browser / PWA
    ↓
Next.js web application
    ↓
Application commands/services
    ↓
Owning domain module
    ↓
PostgreSQL transaction + outbox/audit
    ↓
Worker / jobs / adapters
```

AI, platform providers and object-storage providers are adapters around the core. They must never become the source of truth.

## 2. Normative sources and precedence

Codex must read before implementation:

1. `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md`
2. `docs/artist-os/00_governance/ARCHITECTURE_RESOLUTION_PASS1.md` — AR-001…AR-062
3. `docs/artist-os/engineering/README.md`
4. `docs/artist-os/engineering/01_SYSTEM_ARCHITECTURE.md`
5. `docs/artist-os/engineering/02_DATA_MODEL_CONVENTIONS.md`
6. `docs/artist-os/engineering/03_LOGICAL_DATA_MODEL.md`
7. `docs/artist-os/engineering/04_DOMAIN_COMMANDS_EVENTS.md`
8. `docs/artist-os/engineering/05_APPLICATION_SERVICES.md`
9. `docs/artist-os/engineering/06_API_CONTRACTS.md`
10. `docs/artist-os/engineering/07_JOBS_WORKERS.md`
11. `docs/artist-os/engineering/08_AI_RUNTIME.md`
12. `docs/artist-os/engineering/09_STORAGE_MEDIA.md`
13. `docs/artist-os/engineering/11_SECURITY_PRIVACY.md`
14. `docs/artist-os/engineering/12_OBSERVABILITY.md`
15. `docs/artist-os/engineering/13_TESTING_TRACEABILITY.md`
16. `docs/artist-os/engineering/14_MIGRATIONS_ROLLBACK.md`
17. `docs/artist-os/engineering/15_DEPLOYMENT_OPERATIONS.md`
18. this handoff + `STAGE_0_ACCEPTANCE_CHECKLIST.md`

Precedence:

```text
MASTER v1.4
→ AR companion contracts
→ Product Specs
→ Engineering Specs
→ Stage 0 handoff
→ implementation detail
```

If Stage 0 appears to conflict with a higher layer, stop that implementation choice and follow the higher layer. Do not silently “improve” architecture.

## 3. Stage 0 scope

### In scope

- repository/workspace bootstrap;
- web process;
- worker process;
- TypeScript strict configuration;
- environment validation;
- PostgreSQL + pgvector local infrastructure;
- Drizzle schema/migration foundation;
- authentication and artist ownership scope;
- minimal Artist + WorkspaceSettings foundation;
- application command/result primitives;
- domain event + transactional outbox primitives;
- durable Job model + worker runtime;
- AuditEvent foundation;
- idempotency primitives;
- storage provider abstraction + development implementation;
- AI provider/runtime abstractions with disabled/mock provider;
- structured logging + trace/correlation propagation;
- `/live` and `/ready` health endpoints;
- common API error/response envelope;
- dark-first design-system tokens and application shell;
- test harness and CI;
- seed/bootstrap flow for local development;
- documentation for local run, migration, test and deployment assumptions.

### Explicitly out of scope

Do not implement full Identity, Song Brain, Content Factory, Campaign, DSP, Analytics, Growth, Business or Knowledge experiences in Stage 0.

Do not create all MASTER entities/tables “for completeness”.

Do not implement:

```text
Advertising execution
Publicity / outreach CRM
accounting ledger
inventory/order system
multi-organization billing
team/role collaboration
full platform integrations
real publishing
real AI agent workflows
full asset ingest/transcoding
full PWA On-Set offline workflow
```

Stage 0 creates extension points for later slices, not fake completed features.

## 4. Technology baseline

Use a TypeScript workspace with one versioned lockfile.

Preferred baseline:

```text
pnpm workspaces
Next.js 16.x Active LTS or latest security-patched compatible 16.x
React supported by that Next.js release
TypeScript strict
Tailwind CSS
thin shadcn/ui-based component layer
PostgreSQL with pgvector available
Drizzle ORM + drizzle-kit migrations
Better Auth for the concrete MVP auth adapter
Vitest for unit/integration tests
Playwright for web smoke/E2E where practical
```

Do not pin stale versions from this document. At implementation time select current security-patched stable versions compatible with one another, commit exact resolved versions and lockfile, and record them in the Stage 0 completion report.

Provider-specific libraries belong only in infrastructure/integration packages.

## 5. Repository shape

Use a small workspace, not a premature microservice monorepo.

Target shape:

```text
apps/
  web/                 # Next.js application
  worker/              # independently runnable Node worker
packages/
  core/                # domain + application contracts/modules
  db/                  # Drizzle schema, migrations, DB adapters
  infrastructure/      # storage/logging/runtime implementations
  ai/                  # AIProvider abstractions + disabled/mock adapter
  shared/              # primitives only; no cross-domain business logic

docs/
  artist-os/...
```

Inside `packages/core`, bounded modules align to MASTER ownership. Stage 0 only needs real implementation for foundation concerns plus minimal artist/workspace behavior; other domain directories may be absent until their vertical slice begins.

Forbidden architecture:

- `domain` importing Next.js/React;
- `domain` importing Better Auth, OpenAI, S3/AWS or platform SDKs;
- UI writing repositories directly;
- worker writing domain tables directly;
- one giant `services/` folder with mixed ownership;
- universal workflow/CRM/rule engine created speculatively.

## 6. First executable vertical foundation

Stage 0 must include one narrow real flow to prove the architecture:

```text
Authenticated user
→ Create/ensure Artist workspace
→ CreateArtist application command
→ Artist domain validation
→ PostgreSQL transaction
→ Artist record + ArtistCreated outbox event + AuditEvent
→ API response with traceId
→ outbox dispatcher/worker consumes event idempotently
```

No fake UI-only data. No direct table inserts from the route handler.

This foundation is not “Phase 1 Artist feature implementation”; it is the minimal executable architecture proof.

## 7. Authentication and artist scope

Use a concrete replaceable auth adapter; Better Auth is the preferred Stage 0 implementation because it supports self-hosted Next.js authentication without coupling domain code to an external auth SaaS.

Requirements:

- auth secrets server-side only;
- sign-in/sign-out and session restore work locally;
- application receives an authenticated actor/user context;
- each user is mapped to one artist workspace in single-artist MVP;
- `artistId` is explicitly enforced in application/repository access;
- future team roles are not implemented;
- auth-provider tables remain infrastructure-owned, not Artist-domain truth;
- no “single user means no authorization” shortcut.

Development bootstrap may provide a documented seed user, but no hardcoded production credential.

## 8. Database and migrations

Stage 0 physical schema should be intentionally small.

Minimum product/infrastructure tables:

```text
Artist
WorkspaceSettings
AuditEvent
OutboxEvent
ConsumerInbox / processed-event equivalent
Job
IdempotencyRecord or equivalent durable idempotency store
```

Plus auth-provider tables required by the selected adapter.

Do not create placeholder tables for every v1.4 entity.

Rules:

- UUID-compatible opaque IDs;
- `timestamptz` for instants;
- IANA workspace timezone;
- artist-scoped ownership where required;
- migration files committed to git;
- migration history/checksum convention documented;
- schema change via generated/reviewable migration, not production `push`;
- local disposable DB may use convenience tooling, but canonical path is generate + migrate;
- pgvector extension available even if embeddings are not yet used.

Provide Docker Compose (or equally simple local infrastructure) for PostgreSQL/pgvector.

## 9. Commands, events, outbox and audit

Create reusable primitives matching Engineering Specs.

Command context must support:

```text
commandId
artistId
actor
requestedAt
idempotencyKey?
expectedVersion?
traceId
```

Standard command result classes/envelope must cover:

```text
SUCCESS
VALIDATION_ERROR
CONFLICT
FORBIDDEN
NOT_FOUND
BLOCKED
RETRYABLE_FAILURE
EXTERNAL_FAILURE
```

Domain events are immutable facts with versioned payloads.

Outbox write occurs in the same DB transaction as the owning mutation.

At-least-once consumers use inbox/event-id dedupe.

Audit and telemetry are separate concerns.

## 10. Job runtime

Implement PostgreSQL-backed durable jobs sufficient to prove:

- queue;
- claim/lease;
- heartbeat or lease expiry;
- retry policy;
- max attempts;
- dead-letter state;
- cancellation contract foundation;
- idempotent handler execution;
- trace/correlation propagation;
- independently runnable worker.

Production code must not rely on an in-memory queue for durable work.

Use a test-only handler or implementation-only safe maintenance handler for worker integration tests rather than inventing product behavior.

## 11. Storage foundation

Define provider-neutral `StorageProvider` interface.

Stage 0 must implement a development provider sufficient for automated tests and local use. Local filesystem is acceptable.

Define, but do not overbuild, the contract for S3-compatible production storage.

Requirements:

- opaque keys;
- private-by-default semantics;
- checksum/head verification primitives;
- short-lived access URL abstraction;
- no public URL as canonical asset identity;
- temporary artifact namespace/retention hook.

Full Asset domain and upload UX are later slices.

## 12. AI runtime foundation

Do not implement “AI features” yet.

Create interfaces/contracts for:

```text
AIProvider
AIRequest / structured output schema
AIResult
Provider/model metadata
cost/latency metadata
AI disabled/unconfigured error mode
```

Provide a deterministic disabled/mock adapter for tests.

The web app must boot and the core vertical flow must work with no AI API key.

Do not add AgentRun, prompt registry, vector retrieval or agent orchestration tables unless required by the minimal Stage 0 implementation. Those belong to later AI/Knowledge slices.

## 13. Observability and errors

Implement structured, redacted logs for both web and worker.

Every request creates/accepts `traceId`; propagate it through command, DB transaction metadata, outbox/event and job context.

Minimum log fields:

```text
timestamp
level
service/process
environment
traceId
operation
safe message
durationMs?
errorCode?
```

No secrets, signed URLs or protected canon in logs.

Expose:

```text
/live   # process alive
/ready  # required local runtime dependencies usable
```

Optional AI/provider outage must not make core readiness fail.

API responses follow Engineering Spec response/error envelope and include trace ID metadata.

## 14. Web shell and design foundation

Stage 0 creates visual infrastructure, not final module UX.

Implement:

- dark-first premium shell;
- design tokens for background/surface/border/text/accent/status;
- typography scale;
- spacing/radius/elevation primitives;
- accessible focus states;
- responsive left navigation shell;
- top context/header region;
- command-palette infrastructure placeholder;
- authenticated loading/error/empty patterns;
- Overview landing shell with system/workspace status, not fake business KPIs.

Primary navigation must be registry-driven so future sections can be added without scattering route metadata.

Do not fill the product with lorem ipsum dashboards or fabricated analytics.

## 15. Testing foundation

Set up:

- unit tests for command/domain primitives;
- PostgreSQL integration tests for repository transaction, outbox and jobs;
- auth/session integration test;
- API contract smoke test;
- worker retry/idempotency integration test;
- storage-provider contract test;
- AI-disabled test;
- web smoke test;
- architecture-boundary test or lint rule preventing forbidden imports.

CI gate:

```text
install with frozen lockfile
lint
typecheck
unit tests
integration/contract tests
build
migration/schema check
```

Live provider credentials are never required for normal PR CI.

## 16. Environment and local developer experience

Provide:

```text
.env.example
local infrastructure compose file
one command to install
one command to start dependencies
one command to migrate
one command to seed/bootstrap
one command to run web + worker
one command to test
```

Startup config is schema-validated. Missing required DB/auth configuration fails clearly. Missing AI/provider configuration degrades only those adapters.

No secret values in git.

## 17. CI and repository hygiene

Add GitHub Actions for Stage 0 quality gate.

Commit:

- lockfile;
- migration SQL/history;
- configuration examples;
- formatter/linter config;
- test config;
- architecture README;
- ADR only where implementation choice is not already fixed by MASTER/Engineering.

Do not modify frozen MASTER v1.4 to justify implementation convenience.

## 18. Stage 0 implementation order

Codex should work in these increments and keep each increment buildable:

```text
S0.1 Workspace/tooling/bootstrap
S0.2 PostgreSQL/Drizzle/migrations
S0.3 Auth + Artist/Workspace scope
S0.4 Command/result/audit/outbox primitives
S0.5 Worker + durable jobs/inbox
S0.6 Storage abstraction
S0.7 AI disabled/mock abstraction
S0.8 Observability/health/error envelope
S0.9 Dark application shell/design tokens
S0.10 CI + tests + docs + final integrity pass
```

Do not start Phase 1 Identity/Songs/Knowledge work inside this PR.

## 19. Required Codex completion report

At the end Codex must return and commit a report containing:

- branch name and commit SHA(s);
- exact dependency/runtime versions selected;
- resulting repository tree;
- database tables/migrations created;
- environment variables introduced;
- commands to run local/CI;
- tests added and actual results;
- health endpoints and smoke result;
- architecture-boundary checks;
- known limitations;
- deferred items;
- mapping from Stage 0 acceptance IDs to implementation files/tests;
- confirmation that no Phase 1+ business scope was silently implemented.

## 20. Change-control rule

If Codex encounters a contradiction that requires changing MASTER/domain ownership/cardinality/human-approval semantics, it must not improvise.

Instead:

1. document the blocker;
2. continue independent Stage 0 work where possible;
3. propose the smallest architecture/engineering clarification;
4. do not alter frozen MASTER without a separate human-approved architecture change.

Implementation convenience is not architecture authority.
