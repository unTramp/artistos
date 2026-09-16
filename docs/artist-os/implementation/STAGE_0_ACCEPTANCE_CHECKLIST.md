# Artist OS — Stage 0 Acceptance Checklist

**Purpose:** objective merge gate for the first implementation PR.
**Baseline:** `MASTER_ARCHITECTURE_v1.4.md` + Engineering Specs + Stage 0 handoff.

A Stage 0 PR is not complete because the app “runs”. It is complete only when the foundation is demonstrably reusable by later vertical slices.

## A. Repository and runtime

- [ ] **S0-ACC-001** Root workspace uses one package manager and one committed lockfile.
- [ ] **S0-ACC-002** `apps/web` starts independently.
- [ ] **S0-ACC-003** `apps/worker` starts independently.
- [ ] **S0-ACC-004** Shared domain/application code is not duplicated between web and worker.
- [ ] **S0-ACC-005** TypeScript strict mode is enabled for production packages.
- [ ] **S0-ACC-006** Production build completes without ignored type errors.
- [ ] **S0-ACC-007** No provider SDK is imported from domain code.
- [ ] **S0-ACC-008** No React/Next.js code is imported from domain code.

## B. Configuration and local environment

- [ ] **S0-ACC-009** `.env.example` contains names/descriptions only, no real secrets.
- [ ] **S0-ACC-010** Environment is schema-validated at startup.
- [ ] **S0-ACC-011** Missing required DB/auth config fails with actionable safe error.
- [ ] **S0-ACC-012** Missing optional AI/provider config does not prevent core boot.
- [ ] **S0-ACC-013** Local PostgreSQL/pgvector can be started from documented repository command.
- [ ] **S0-ACC-014** Fresh clone instructions are sufficient to reach running web + worker without undocumented manual DB edits.

## C. Authentication and artist scope

- [ ] **S0-ACC-015** User can authenticate, restore a session and sign out.
- [ ] **S0-ACC-016** Auth implementation is isolated from Artist domain ownership.
- [ ] **S0-ACC-017** Authenticated application context exposes actor/user ID and artist scope.
- [ ] **S0-ACC-018** Repository/application reads cannot accidentally return another artist scope when an `artistId` boundary applies.
- [ ] **S0-ACC-019** Single-artist MVP does not bypass authorization checks.
- [ ] **S0-ACC-020** No production credential is hardcoded for local convenience.

## D. Database and migrations

- [ ] **S0-ACC-021** Drizzle schema and generated SQL migrations are committed.
- [ ] **S0-ACC-022** Clean database can migrate from zero to current head.
- [ ] **S0-ACC-023** Migration metadata/history is deterministic and documented.
- [ ] **S0-ACC-024** Stage 0 schema contains only justified foundation/product tables, not speculative full MASTER schema.
- [ ] **S0-ACC-025** `Artist` and `WorkspaceSettings` follow artist ownership/timezone conventions.
- [ ] **S0-ACC-026** Instants use PostgreSQL timezone-aware semantics.
- [ ] **S0-ACC-027** pgvector capability is available without forcing embeddings into Stage 0.
- [ ] **S0-ACC-028** Normal production migration path is generate/review/migrate, not destructive schema push.

## E. Executable architecture proof

- [ ] **S0-ACC-029** Artist creation/ensure flow enters through application command/service, not direct route→DB write.
- [ ] **S0-ACC-030** Domain validation can be unit-tested without Next.js/DB/provider runtime.
- [ ] **S0-ACC-031** Successful artist creation persists Artist state transactionally.
- [ ] **S0-ACC-032** Same transaction persists `ArtistCreated` outbox evidence.
- [ ] **S0-ACC-033** Significant mutation emits/records AuditEvent as defined by the foundation contract.
- [ ] **S0-ACC-034** API response contains trace metadata.
- [ ] **S0-ACC-035** Repeating an idempotent command does not duplicate Artist/outbox/external effect state.

## F. Outbox, inbox and events

- [ ] **S0-ACC-036** Event envelope has stable ID, type, time, aggregate refs, correlation/causation and payload version.
- [ ] **S0-ACC-037** Outbox append and domain mutation share one database transaction.
- [ ] **S0-ACC-038** Dispatcher can recover after process restart.
- [ ] **S0-ACC-039** Consumer dedupe/inbox prevents duplicate durable effect for the same event.
- [ ] **S0-ACC-040** Event names describe facts, not imperative commands.

## G. Jobs and worker

- [ ] **S0-ACC-041** Durable Job record supports queued/running/succeeded/failed/cancelled/dead-letter states required by Engineering Spec.
- [ ] **S0-ACC-042** Worker claims work with lease/lock semantics.
- [ ] **S0-ACC-043** Abandoned/expired work can become eligible again safely.
- [ ] **S0-ACC-044** Retry policy is bounded by max attempts.
- [ ] **S0-ACC-045** Exhausted retry enters dead-letter state.
- [ ] **S0-ACC-046** Handler execution is idempotency-safe.
- [ ] **S0-ACC-047** Worker propagates trace/correlation IDs.
- [ ] **S0-ACC-048** Worker shutdown stops claiming new work and does not silently lose queued state.

## H. Storage

- [ ] **S0-ACC-049** Application depends on `StorageProvider` interface rather than concrete filesystem/S3 calls.
- [ ] **S0-ACC-050** Development storage provider has automated contract tests.
- [ ] **S0-ACC-051** Object keys are opaque and authorization is not inferred from paths.
- [ ] **S0-ACC-052** Checksum/head verification primitive exists.
- [ ] **S0-ACC-053** Access URL abstraction is temporary/signed/private by default in contract semantics.
- [ ] **S0-ACC-054** Canonical records never require a public URL as asset identity.

## I. AI boundary

- [ ] **S0-ACC-055** Core product boots with no AI key/provider configured.
- [ ] **S0-ACC-056** AI provider is an interface/adapter boundary outside domain code.
- [ ] **S0-ACC-057** Disabled/mock provider returns deterministic typed outcomes for tests.
- [ ] **S0-ACC-058** No AI output is directly persisted as canonical domain state through an adapter shortcut.
- [ ] **S0-ACC-059** No chain-of-thought persistence field is introduced.
- [ ] **S0-ACC-060** Stage 0 does not prematurely implement agent orchestration/vector retrieval tables.

## J. API and error contracts

- [ ] **S0-ACC-061** API success envelope uses `{ data, meta: { traceId } }` semantics.
- [ ] **S0-ACC-062** API errors expose machine code + safe message + retryability/field errors where relevant.
- [ ] **S0-ACC-063** Internal stack traces/secrets are not returned to browser.
- [ ] **S0-ACC-064** Mutation endpoints invoke application command/service boundary.
- [ ] **S0-ACC-065** Idempotency mechanism is available for retryable/external-effect commands.
- [ ] **S0-ACC-066** Optimistic concurrency primitive is defined even if the minimal Artist flow has limited concurrent editing.

## K. Observability and health

- [ ] **S0-ACC-067** Web and worker logs are structured.
- [ ] **S0-ACC-068** Logs include service/process, environment, trace ID, operation and safe message.
- [ ] **S0-ACC-069** Logging layer redacts known secret/token fields.
- [ ] **S0-ACC-070** `/live` reports process liveness without external optional-provider dependency.
- [ ] **S0-ACC-071** `/ready` checks required runtime dependencies such as DB.
- [ ] **S0-ACC-072** AI/provider outage does not fail core readiness when the core can degrade.
- [ ] **S0-ACC-073** A trace can be followed request → command → outbox/job/worker in test or documented smoke evidence.

## L. Security

- [ ] **S0-ACC-074** Secrets are server-side and absent from client bundle.
- [ ] **S0-ACC-075** No credentials/signed URLs/private canon appear in normal logs.
- [ ] **S0-ACC-076** Object/storage foundation is private by default.
- [ ] **S0-ACC-077** Sensitive config is separated from domain records.
- [ ] **S0-ACC-078** Dependency install uses lockfile and CI includes dependency/security hygiene appropriate to the selected toolchain.

## M. UI shell

- [ ] **S0-ACC-079** Authenticated dark-first application shell renders without fabricated product metrics.
- [ ] **S0-ACC-080** Core design tokens are centralized.
- [ ] **S0-ACC-081** Navigation metadata is registry-driven.
- [ ] **S0-ACC-082** Overview foundation reflects actual workspace/system state only.
- [ ] **S0-ACC-083** Keyboard focus and basic accessibility states are present.
- [ ] **S0-ACC-084** Loading/error/empty patterns exist for foundation screens.
- [ ] **S0-ACC-085** Shell is responsive enough not to block later PWA/mobile production workflows.

## N. Tests and CI

- [ ] **S0-ACC-086** `lint` passes.
- [ ] **S0-ACC-087** `typecheck` passes.
- [ ] **S0-ACC-088** unit tests pass.
- [ ] **S0-ACC-089** PostgreSQL integration tests pass against disposable test DB.
- [ ] **S0-ACC-090** outbox/inbox integration test passes.
- [ ] **S0-ACC-091** job retry/dead-letter/idempotency integration test passes.
- [ ] **S0-ACC-092** auth/session test passes.
- [ ] **S0-ACC-093** storage provider contract test passes.
- [ ] **S0-ACC-094** AI-disabled test passes.
- [ ] **S0-ACC-095** web build passes.
- [ ] **S0-ACC-096** at least one web smoke/E2E flow passes.
- [ ] **S0-ACC-097** architecture import-boundary check passes.
- [ ] **S0-ACC-098** CI runs without live AI/social/DSP credentials.

## O. Documentation and handoff

- [ ] **S0-ACC-099** Root README explains setup/run/test/migrate.
- [ ] **S0-ACC-100** Repository tree and architectural boundaries are documented.
- [ ] **S0-ACC-101** Environment variables are documented.
- [ ] **S0-ACC-102** Migration workflow is documented.
- [ ] **S0-ACC-103** Worker/job recovery behavior is documented.
- [ ] **S0-ACC-104** Stage 0 completion report maps every acceptance ID to file/test/evidence or explicitly marks N/A with reason.
- [ ] **S0-ACC-105** Selected dependency versions are recorded.
- [ ] **S0-ACC-106** Known limitations/deferred items are recorded.
- [ ] **S0-ACC-107** No frozen MASTER file was edited to fit implementation convenience.
- [ ] **S0-ACC-108** No Phase 1+ feature is represented as complete merely through placeholder UI/schema.

## Merge gate

Stage 0 implementation may be merged when:

1. all applicable P0 acceptance items above are satisfied;
2. every unchecked item has an explicit reviewed justification;
3. CI is green;
4. migrations are reviewed;
5. architecture boundaries have no known silent violation;
6. the completion report is committed in the PR.

After merge, implementation moves to vertical product slices rather than horizontal “build every table/API first” work.
