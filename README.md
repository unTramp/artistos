# Artist OS

Artist OS is a human-controlled, AI-assisted operating system for independent artists.

Its product thesis is not “more dashboards” or “an AI writer”. Artist OS should remember the artist's career, connect context across work and help answer what matters next.

Core product formula:

`Context + Memory + Decisions + Execution`

## Current implementation status

- **Stage 0 — Foundation** ✅
  - modular monolith runtime;
  - Next.js web + durable worker;
  - PostgreSQL / pgvector;
  - Better Auth;
  - audit / outbox / jobs / idempotency;
  - provider boundaries and AI-disabled degraded mode.
- **Phase 1 — Artist Foundation** ✅
  - Artist Identity versions / Era;
  - Songs and Song Brain;
  - Knowledge Inbox / Tone Corpus / Artist Brain projection.
- **Phase 2 — Content Factory** ✅
  - Content Angles and human review;
  - Content Units;
  - versioned Content Execution Revisions;
  - bounded Context Assembler;
  - structured AI Angle proposals / AgentRun provenance;
  - manual workflows continue to work with AI disabled.
- **Phase 2.5 — Daily OS / Decision Intelligence** ✅
  - Today / deterministic Attention projection;
  - Current Focus / PlanningObjective;
  - OperationalAction lifecycle and Today action controls;
  - WHY / provenance traversal;
  - Decision Memory and Learning Memory;
  - immutable Weekly Review;
  - Brain / Memory information architecture;
  - contextual Learn → Apply guidance;
  - command palette;
  - deep-work ergonomics and product telemetry closure.

MASTER v1.4 remains the frozen architecture Source of Truth. Phase 2.5 changes product priority and surface, not canonical domain ownership.

## Product principles

See `docs/artist-os/PRODUCT_PRINCIPLES.md`.

Key rules:

- Complex system, simple surface.
- Context before generation.
- Memory must compound.
- Decisions preserve why.
- AI proposes; humans commit.
- Unknown is better than invented.
- Daily usefulness before feature breadth.
- Deep domains, shallow navigation.

## Requirements

- Node.js `>=22.16.0` — use native Apple Silicon Node on Apple Silicon Macs when possible;
- pnpm `12.4.1` through Corepack;
- Docker / Docker Compose;
- PostgreSQL 17 + pgvector through the local compose stack.

Package manifests are the executable authority for exact dependency versions.

## Local setup

```bash
corepack enable
cp .env.example .env
docker compose up -d
pnpm install
pnpm db:migrate
pnpm dev
```

Open:

```text
http://localhost:3000
```

`pnpm dev` starts both web and worker. The worker dev command loads the repository-root `.env` explicitly.

For isolated debugging:

```bash
pnpm dev:web
pnpm dev:worker
```

If port 3000 is already occupied by an old Next.js process, stop that process before starting another dev server.

## First-run product flow

1. Open `/auth`.
2. Create an account.
3. Signup redirects to `/onboarding`.
4. Create the Artist workspace in the UI.
5. Open Today and establish Identity / Songs / Brain progressively.

No DevTools API call should be required for normal onboarding.

## Local demo data

After onboarding, an otherwise empty local Artist workspace can be populated with realistic development data:

```bash
pnpm demo:seed
```

The command is intentionally safe-by-default:

- it requires an existing authenticated Artist workspace;
- it refuses to run if that Artist already has Identity, Songs or Content Angles;
- with more than one local Artist workspace, choose one explicitly:

```bash
DEMO_EMAIL=you@example.test pnpm demo:seed
```

Demo data is never part of migrations and never runs in production. It exists only to exercise the product visually and during local UX development.

## AI provider modes

`.env` supports:

```text
AI_PROVIDER=disabled
AI_PROVIDER=mock
```

`disabled` is a supported product mode, not an error condition. Canonical manual workflows and Today must remain useful without AI.

`mock` exists for deterministic local/demo proposal flows without a paid provider.

## Database migrations

Canonical migrations live in `packages/db/drizzle/` and are applied with:

```bash
pnpm db:migrate
```

Do not use destructive schema push as the production migration path.

Better Auth tables are infrastructure-owned and live in PostgreSQL schema `auth`. They are created by reviewed project migrations (`0002_auth_schema`, `0003_better_auth`), not by running ad-hoc auth migrations in normal local setup.

## Quality commands

```bash
pnpm arch:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
```

CI applies migrations to clean PostgreSQL before the integration/build/E2E gates.

## Runtime shape

```text
Browser / PWA
  → Next.js presentation / route handlers
  → application services
  → owning domain modules
  → PostgreSQL transaction + audit / outbox
  → worker / jobs / provider adapters
```

The deterministic product core must continue to work when AI and optional external providers are unavailable.

## Workspace

```text
apps/
  web/             Next.js product runtime and UI
  worker/          durable worker runtime
packages/
  core/            domain/application contracts
  db/              schema, migrations, readers/writers
  infrastructure/  env, storage, logging
  ai/              provider abstraction and structured agents
  shared/          primitives only
docs/artist-os/
  00_governance/   frozen MASTER / architecture governance
  engineering/     reconciled engineering contracts
  implementation/  implementation plans / completion reports
```

## Normative implementation sources

1. `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md`
2. approved AR / ACP contracts;
3. `docs/artist-os/engineering/`;
4. phase-specific implementation plans.

Product principles guide prioritization and UX but do not silently rewrite frozen domain architecture.

## Current product priority

Do not expand into another large horizontal domain until Daily OS proves the core loop:

`Open → understand state → next action → why → act → preserve evidence/decision → future recommendation improves`.

The active roadmap is documented in `docs/artist-os/implementation/PHASE_2_5_DAILY_OS_PLAN.md`.
