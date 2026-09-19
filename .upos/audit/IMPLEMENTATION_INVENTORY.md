# Artist OS — Implementation Inventory

Audit baseline: main @ 94ff0e0219bd441b02044f419528b7243b9b318f
Confidence: repository-backed unless marked otherwise.

## 1. Runtime topology

| Area | Current evidence | State |
|---|---|---|
| Web application | apps/web, Next.js/React/TypeScript | IMPLEMENTED |
| Worker | apps/worker/src/index.ts | IMPLEMENTED foundation |
| Domain/application contracts | packages/core | IMPLEMENTED for shipped slices |
| Persistence | PostgreSQL 17 + pgvector, Drizzle | IMPLEMENTED |
| Infrastructure | env, structured logging, local private storage | IMPLEMENTED foundation |
| AI abstraction | packages/ai AIProvider | IMPLEMENTED abstraction |
| Live AI provider | runtime allows disabled or mock only | NOT IMPLEMENTED |
| Durable jobs | PostgreSQL job queue with retry/lease/dead-letter foundation | IMPLEMENTED foundation |
| Product job handlers | worker currently registers STAGE0_NOOP only | SCAFFOLDED |
| Authentication | Better Auth, email/password | IMPLEMENTED |
| Authorization scope | server-derived auth user → artist membership | IMPLEMENTED for single-artist MVP |
| CI | GitHub Actions quality pipeline | CONFIGURED |
| Production deployment target | no authoritative runtime deployment binding found in inspected evidence | UNRESOLVED |

## 2. Applications and packages

### apps/web
Owns presentation, route handlers, authenticated actor resolution, UI orchestration, product telemetry emission and current synchronous Content Angle AI generation entry point.

Important current routes/surfaces observed through repository history and files:
- authentication/onboarding;
- Today / deterministic Attention;
- Identity;
- Songs / Song Brain;
- Knowledge / Artist Brain;
- Content Factory / execution revisions;
- Planning Objectives;
- Operational Actions;
- Decision Memory;
- Learning Memory;
- Weekly Review;
- Memory workspace.

### apps/worker
Durable worker loop consuming outbox events and jobs. Graceful shutdown is implemented. Product-specific handlers have not yet replaced the Stage-0-only STAGE0_NOOP handler.

### packages/core
Owns provider-independent domain/application contracts. Current examples include Artist foundation, Content Factory, Content Execution, Context Assembler, Agent Run contracts, OperationalAction, AttentionProjection, PlanningObjective, Decision, Learning and WeeklyReview.

The architecture check prevents selected provider/runtime imports from packages/core.

### packages/db
Owns Drizzle schema/migrations and PostgreSQL readers/writers. Migration history observed through PR/file evidence reaches 0019_daily_os_loop_closure.sql.

Foundation and shipped-slice data includes:
- Artist / WorkspaceSettings / artist membership;
- Identity root/version / Era;
- Song / Song Brain / Song Identity Context;
- Knowledge Inbox / Tone Corpus / Artist Brain snapshots;
- outbox / audit / idempotency / consumer inbox / jobs;
- Content Angle / Content Unit / execution revisions;
- AgentRun persistence;
- Operational Actions;
- Planning Objectives;
- Decision Memory;
- Learnings;
- Weekly Reviews;
- product telemetry.

### packages/infrastructure
Runtime env validation, structured Pino logging/redaction and private local StorageProvider.

### packages/ai
Provider-neutral structured AI contract and DisabledAIProvider. Web runtime currently supplies deterministic mock or disabled provider.

### packages/shared
Shared primitives only by intended architecture; detailed content not exhaustively inspected in this pass.

## 3. Build and quality commands

Executable authority: root package.json.

- pnpm arch:check
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm test:integration
- pnpm build
- pnpm test:e2e
- pnpm db:migrate

CI also:
- installs with frozen lockfile;
- applies migrations to clean PostgreSQL;
- regenerates Better Auth SQL and rejects drift;
- installs Playwright Chromium and runs E2E.

Current baseline run result: NEEDS EVIDENCE in this audit because the connector exposed no workflow run for the audited merge commit and no executable checkout was available.

## 4. Security/runtime controls observed

Positive controls:
- server-side session resolution;
- server-derived artist scope rather than client-provided ownership ID;
- validated runtime env;
- AUTH_SECRET minimum length;
- trusted Better Auth origin;
- private local storage, traversal-resistant opaque keys;
- structured logger with tested password/token/secret/authorization redaction;
- transactional audit and outbox foundation;
- user-scoped idempotency for Artist creation;
- CI permission is contents:read.

Observed concerns:
- .gitignore does not exclude root .env even though README instructs creating it;
- .gitignore does not exclude .data/ even though STORAGE_ROOT defaults to .data/storage;
- email/password auth explicitly sets requireEmailVerification: false;
- no U-POS security permission/protected-action semantics are currently bound.

No committed .env, .env.local, .env.production, .env.development, apps/web/.env or apps/web/.env.local was found at current main through direct path checks. Historical secret exposure was not exhaustively scan-able through the available interface.

## 5. Product implementation coverage

| Capability | Current classification | Evidence summary |
|---|---|---|
| Artist root/workspace | IMPLEMENTED | Stage 0 |
| Identity version / active Era | PARTIALLY_IMPLEMENTED | Phase 1 foundation |
| Archetype discovery | DOCUMENTED_ONLY | no inspected runtime slice |
| Emotional Territory | DOCUMENTED_ONLY | no inspected runtime slice |
| Listening / sensory associations | DOCUMENTED_ONLY | no inspected runtime slice |
| Moodboard / Visual DNA | DOCUMENTED_ONLY | no inspected runtime slice |
| Narrative / Mystique / Anchors / Brand Book | DOCUMENTED_ONLY | no inspected runtime slice |
| Songs / Song Brain | IMPLEMENTED | Phase 1 |
| Song Segment Intelligence / AudioUsage | DOCUMENTED_ONLY | not in inspected runtime |
| Knowledge Inbox / Tone Corpus / Artist Brain | IMPLEMENTED | Phase 1 + PR25 reconciliation |
| Content Angles | IMPLEMENTED | Phase 2 |
| Content Unit / execution revision | IMPLEMENTED | Phase 2 |
| Context Assembler for Content Angles | IMPLEMENTED, bounded | campaign/platform/production owner inputs remain absent |
| Live model-backed Content Factory | SCAFFOLDED | provider is disabled/mock only |
| Pipeline / shoots / assets / smart ingest | DOCUMENTED_ONLY or NOT YET IMPLEMENTED in inspected runtime |
| PlanningObjective | IMPLEMENTED | Phase 2.5 |
| OperationalAction | IMPLEMENTED | Phase 2.5 |
| Deterministic Attention / Today | IMPLEMENTED | Phase 2.5 |
| Decision Memory | IMPLEMENTED | Phase 2.5 |
| Learning Memory | IMPLEMENTED | Phase 2.5 |
| Weekly Review | IMPLEMENTED | Phase 2.5 |
| Provenance traversal / Why | IMPLEMENTED | Phase 2.5 |
| Product telemetry summary | IMPLEMENTED, bounded | Phase 2.5 |
| Distribution / DSP | DOCUMENTED_ONLY | future vertical |
| Growth / markets / Live / collaboration | DOCUMENTED_ONLY | future vertical |
| Business / fan value | DOCUMENTED_ONLY | future vertical |
| Advertising | DEFERRED RESEARCH BOUNDARY | intentionally outside frozen core |
| Publicity | DEFERRED RESEARCH BOUNDARY | intentionally outside frozen core |

## 6. Architecture observations

Strong current boundaries:
- modular-monolith-first structure;
- packages/core is provider-independent by explicit automated import check;
- canonical mutations generally cross application/domain/persistence boundaries rather than route-to-table shortcuts;
- AI proposal acceptance remains separate from canonical creation/approval;
- deterministic Today does not require AI;
- Candidate Knowledge does not become durable Brain truth without explicit user action;
- scoped Learning applicability was reconciled in PR25;
- Artist Brain now compiles eligible validated Learnings.

Architecture drift requiring attention:
- the Content Angle generation request calls the AI provider inside the HTTP request path, while MASTER v1.4 §347 requires long-running AI/research/media operations through JobService;
- worker product handlers remain Stage-0-only;
- the architecture checker only protects packages/core from a selected forbidden-import list and does not prove the full dependency graph/cycle/ownership model.

## 7. Data ownership notes

Observed owner boundaries are generally coherent:
- Identity versioning owns active Identity;
- Song owns song meaning, with Release separated by v1.4 architecture even though Release runtime is not implemented;
- Artist Brain is a projection over approved knowledge/context rather than a second Identity owner;
- Learning has a canonical lifecycle and feeds bounded context only when applicable;
- Decision Memory remains distinct from Learning;
- OperationalAction does not own source-domain truth.

No destructive schema issue or current data-corruption path was confirmed in this pass.
