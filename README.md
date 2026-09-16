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

## Requirements and selected pins

- Node.js `>=22.16.0`
- pnpm `12.4.1`
- Next.js `16.3.5`
- React / React DOM `19.3.0`
- Better Auth runtime + CLI `1.7.3`
- Drizzle ORM `0.45.2` / Drizzle Kit `0.31.10`
- TypeScript `5.9.3`
- Vitest `5.0.1`
- Playwright `1.63.0`
- PostgreSQL 17 + pgvector for local/CI infrastructure
- Docker / Docker Compose for local PostgreSQL

Package manifests remain the executable authority for dependency versions.

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

Run the processes independently when debugging runtime boundaries:

```bash
pnpm dev:web
pnpm dev:worker
```

Health endpoints:

```text
GET /api/live
GET /api/ready
```

`/api/ready` requires PostgreSQL but intentionally does not require AI or external platform providers.

## Environment

`.env.example` contains development-safe examples only. Never commit production credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | no | `development`, `test`, or `production` |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Better Auth server secret; minimum 32 characters |
| `AUTH_BASE_URL` | yes | canonical web/auth origin |
| `ARTIST_OS_DEFAULT_TIMEZONE` | no | fallback workspace timezone; defaults to `UTC` |
| `AI_PROVIDER` | no | `disabled` or `mock` in Stage 0; defaults to `disabled` |
| `LOG_LEVEL` | no | structured pino log level |
| `STORAGE_ROOT` | no | private local-development object root |

Environment values are validated at runtime. Validation errors identify invalid fields without echoing secret values.

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

`test:integration` requires PostgreSQL and applied migrations. `test:e2e` expects a production web build; Playwright starts the web process automatically.

## Database and migration workflow

PostgreSQL + pgvector is the canonical transactional foundation. Reviewable SQL migrations live under `packages/db/drizzle/`; Drizzle migration history lives in `packages/db/drizzle/meta/_journal.json`.

Normal domain-schema workflow:

```bash
# 1. change packages/db/src/schema.ts
pnpm db:generate
# 2. review the generated SQL and migration metadata
# 3. apply it through the canonical migrator
pnpm db:migrate
# 4. run integration tests against a clean/migrated database
pnpm test:integration
```

Do **not** use destructive schema push as the production migration path.

Better Auth provider tables are infrastructure-owned and live in the dedicated PostgreSQL `auth` schema. Better Auth `1.7.3` uses the PostgreSQL `search_path` approach in this repository. The provider output is reproducible with:

```bash
pnpm auth:generate
```

The clean CLI output is retained at `packages/db/generated/better-auth.sql`. The reviewed Drizzle migration adds only the schema-selection wrapper required to apply that generated SQL under `auth`. If the auth configuration or pinned Better Auth version changes, regenerate and review the diff before changing migrations.

## Worker, jobs and recovery

The worker is an independent Node process backed by PostgreSQL, not an in-memory queue.

- jobs are claimed with `FOR UPDATE SKIP LOCKED`;
- claims have a lease timestamp and expired running jobs can be reclaimed;
- retries are bounded by `maxAttempts`;
- exhausted retries enter `DEAD_LETTER`;
- permanent failures can enter `FAILED`;
- cancellation is cooperative and supports `CANCELLED`;
- `(job type, idempotency key)` prevents duplicate logical job enqueue;
- `correlationId` / `causationId` survive into worker execution;
- `SIGINT` / `SIGTERM` stop new claims and let in-flight work finish before the DB runtime closes;
- outbox events remain durable across process restarts;
- consumer inbox records prevent duplicate durable event handling.

A worker crash therefore does not delete queued work. Recovery happens from PostgreSQL state on the next worker process.

## Storage and security foundation

Application code depends on `StorageProvider`, not direct filesystem/S3 APIs. The Stage 0 local provider:

- accepts opaque object keys and rejects traversal/absolute-path keys;
- stores private bytes under `STORAGE_ROOT`;
- exposes checksum/head verification;
- does not issue public URLs;
- models future access URLs as private, expiring grants.

Structured logging redacts password/token/secret/authorization fields. Browser error envelopes contain safe messages rather than stack traces or credentials.

## Workspace

```text
apps/
  web/             Next.js runtime, auth boundary, HTTP routes, shell
  worker/          durable worker runtime
packages/
  core/            domain/application contracts
  db/              Drizzle schema, migrations and PostgreSQL adapters
  infrastructure/  env, storage and logging adapters
  ai/              AI provider boundary; disabled adapter in Stage 0
  shared/          primitives only
scripts/
  check-architecture.mjs
  tests/e2e/       browser smoke/session proof
```

`packages/core` may not import Next.js, React, Better Auth, Drizzle, PostgreSQL or concrete provider SDKs. `pnpm arch:check` enforces this Stage 0 boundary.

## Normative implementation sources

1. `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md`
2. `docs/artist-os/engineering/`
3. `docs/artist-os/implementation/STAGE_0_CODEX_IMPLEMENTATION_HANDOFF.md`
4. `docs/artist-os/implementation/STAGE_0_ACCEPTANCE_CHECKLIST.md`

Implementation convenience is not authority to change frozen architecture.

## Stage 0 limitations / deferred work

- no Phase 1 Identity, Songs, Knowledge, Content, DSP or Analytics product implementation;
- no live AI provider or agent orchestration;
- no S3/cloud object provider yet; local private storage proves the port contract;
- no multi-artist/multi-user collaboration model beyond the single-artist owner membership boundary;
- no Phase 1 product navigation or product metrics; the shell only exposes foundation/system state.
