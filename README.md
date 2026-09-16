# Artist OS

Artist OS is a human-controlled, AI-assisted operating system for independent artists.

The repository is implementing **Stage 0 — Foundation** from the frozen MASTER v1.4 architecture. Stage 0 proves the reusable runtime architecture; it does not implement Phase 1+ product domains yet.

## Runtime shape

```text
Browser / PWA
  → Next.js web
  → application commands/services
  → owning domain module
  → PostgreSQL transaction + audit/outbox
  → worker / jobs / adapters
```

The deterministic product core must continue to work when AI and optional external providers are disabled.

## Requirements

- Node.js 22.16+
- pnpm 12.4.1 via Corepack
- Docker / Docker Compose

## Local setup

```bash
corepack enable
cp .env.example .env
docker compose up -d
pnpm install
pnpm db:migrate
pnpm dev
```

Web: `http://127.0.0.1:3000`

Health endpoints:

```text
GET /api/live
GET /api/ready
```

`/api/ready` requires PostgreSQL but intentionally does not require AI or external platform providers.

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

`test:integration` requires the local PostgreSQL service and applied migrations. `test:e2e` expects a production web build; Playwright starts the web process automatically.

## Database

PostgreSQL + pgvector is the canonical transactional foundation. Reviewable SQL migrations live under `packages/db/drizzle/`.

```bash
pnpm db:migrate
pnpm db:generate
```

Do not use schema push as the production migration path.

Better Auth provider tables live in a dedicated PostgreSQL `auth` schema. The provider-owned schema is generated through the supported Better Auth CLI flow rather than handwritten into Artist-domain tables.

## Workspace

```text
apps/
  web/             Next.js runtime
  worker/          durable worker runtime
packages/
  core/            domain/application contracts
  db/              Drizzle schema, migrations and PostgreSQL adapters
  infrastructure/  env, storage and logging adapters
  ai/              AI provider boundary; disabled adapter in Stage 0
  shared/          primitives only
```

`packages/core` may not import Next.js, React, Better Auth, Drizzle, PostgreSQL or concrete provider SDKs. `pnpm arch:check` enforces this Stage 0 boundary.

## Normative implementation sources

1. `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md`
2. `docs/artist-os/engineering/`
3. `docs/artist-os/implementation/STAGE_0_CODEX_IMPLEMENTATION_HANDOFF.md`
4. `docs/artist-os/implementation/STAGE_0_ACCEPTANCE_CHECKLIST.md`

Implementation convenience is not authority to change frozen architecture.
