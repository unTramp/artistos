# Artist OS — Project Manifest Candidate

**Status:** CANDIDATE / AUDIT OUTPUT / NOT YET CANONICAL  
**Project ID:** artist-os  
**Project name:** Artist OS  
**Manifest version:** candidate-0.1  
**Project Adapter version:** candidate-0.1  
**U-POS baseline:** v1.0.0 @ `911b36ee25ae4d523071a24225e407592a6c2735`  
**Audited project revision:** `94ff0e0219bd441b02044f419528b7243b9b318f`  
**Canonical project source ref:** `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md` + its approved companion hierarchy.

This file is a human-readable candidate corresponding to the U-POS-011 Project Manifest contract. It is configuration/binding metadata, not a new Source of Truth for Artist OS product facts.

---

## 1. project

```text
project_id: artist-os
name: Artist OS
canonical_project_source_ref:
  docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md
```

Authority resolution is further described in `.upos/SOURCE_OF_TRUTH_MAP.md`.

Known authority conflicts remain open and are not hidden by this manifest.

---

## 2. upos_baseline

```text
version: v1.0.0
repository: unTramp/upos
revision: 911b36ee25ae4d523071a24225e407592a6c2735
compatibility_state: CANDIDATE_REVIEW_REQUIRED
```

No U-POS files are copied into Artist OS and no U-POS v1.0.0 semantics are modified by this candidate.

---

## 3. repositories

### Primary project repository

```text
repository_ref: artist-os-primary
provider: GitHub
repository: unTramp/artistos
canonical_branch: main
audit_branch: feat/upos-adoption
protected_branch_policy: provider-side state not independently verified in this pass
write_scope_for_audit: feat/upos-adoption only
```

### Framework repository

```text
repository_ref: upos-framework
provider: GitHub
repository: unTramp/upos
baseline_ref: v1.0.0
mode: READ_ONLY
mutation: PROHIBITED
```

---

## 4. important paths

| Binding | Path | Meaning |
|---|---|---|
| canonical architecture | `docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md` | current product/domain architecture |
| companion architecture | `docs/artist-os/00_governance/ARCHITECTURE_RESOLUTION_PASS1.md` | AR-001…AR-062; current status metadata conflict registered |
| documentation index | `docs/artist-os/README.md` | project documentation hierarchy |
| product guidance | `docs/artist-os/PRODUCT_PRINCIPLES.md` | product priority/surface guidance |
| UX doctrine | `docs/artist-os/UX_VISUAL_DIRECTION.md` | presentation/interaction doctrine |
| engineering index | `docs/artist-os/engineering/00_ENGINEERING_SPEC_INDEX.md` | engineering contract entry point |
| implementation evidence/plans | `docs/artist-os/implementation/` | historical evidence and temporary plans; not automatically canonical |
| web runtime | `apps/web/` | Next.js application/presentation/API runtime |
| worker runtime | `apps/worker/` | durable worker runtime |
| domain/application contracts | `packages/core/` | provider-independent project core |
| persistence | `packages/db/` | Drizzle/PostgreSQL schema, migrations, readers/writers |
| infrastructure | `packages/infrastructure/` | env/logging/storage |
| product AI abstraction | `packages/ai/` | Artist OS product AI provider/agents |
| E2E tests | `tests/e2e/` | browser/system evidence |
| project adoption bindings | `.upos/` | U-POS project-side candidate bindings/audit evidence only |

---

## 5. command bindings

Executable source: root `package.json`.

| Capability | Command |
|---|---|
| development | `pnpm dev` |
| web development | `pnpm dev:web` |
| worker development | `pnpm dev:worker` |
| architecture check | `pnpm arch:check` |
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| unit tests | `pnpm test` |
| DB integration tests | `pnpm test:integration` |
| production build | `pnpm build` |
| browser E2E | `pnpm test:e2e` |
| database migration | `pnpm db:migrate` |
| Better Auth schema generation | `pnpm auth:generate` |
| development demo seed | `pnpm demo:seed` |

These commands are engineering evidence producers. Their successful execution does not itself equal a U-POS Quality PASS.

---

## 6. providers

| Provider/capability | Binding |
|---|---|
| repository host | GitHub |
| transactional database | PostgreSQL 17 |
| vector capability | pgvector extension/image |
| ORM/migrations | Drizzle |
| authentication | Better Auth |
| local storage | project LocalStorageProvider |
| production storage | UNRESOLVED |
| AI provider | `disabled` or deterministic `mock` only in current runtime config |
| live AI provider/model | UNRESOLVED / NOT IMPLEMENTED |
| publishing/social/DSP providers | NOT IMPLEMENTED in current audited runtime |
| telemetry backend | local/project persistence and structured logs; no external backend binding identified |
| production secret store | UNRESOLVED |
| deployment provider | UNRESOLVED |

---

## 7. runtime

```text
browser/PWA
→ apps/web Next.js runtime
→ application services / packages/core contracts
→ packages/db PostgreSQL persistence
→ audit/outbox/jobs
→ apps/worker
```

Current worker product handler coverage is foundational; `STAGE0_NOOP` is the only registered job handler found in the audited worker entry point.

Long-running production AI execution is not yet bound to the worker/JobService.

---

## 8. environments

### Local development

Known:
- Node.js >=22.16.0
- pnpm 12.4.1
- Docker / Docker Compose
- PostgreSQL 17 + pgvector
- root `.env` created from `.env.example`
- local private storage defaults to `.data/storage`

Security warning:
Current `.gitignore` does not protect `.env` or `.data/`; see ARTIST-SEC-001.

### CI

Known:
- GitHub Actions
- disposable pgvector/PostgreSQL service
- `NODE_ENV=test`
- AI disabled
- quality/build/E2E pipeline defined in `.github/workflows/ci.yml`

Exact current-baseline run state:
`NEEDS EVIDENCE` in this audit.

### Production

```text
hosting: UNRESOLVED
database resource: UNRESOLVED
storage resource: UNRESOLVED
secret store: UNRESOLVED
deployment command/workflow: UNRESOLVED
rollback binding: UNRESOLVED
```

No production binding is invented.

---

## 9. identity bindings

### Artist OS product identities

Existing examples:
- authenticated Better Auth user ID;
- Artist ID;
- artist membership;
- product domain entity IDs;
- Artist OS product AgentRun ID;
- trace/correlation IDs.

### U-POS execution identities

```text
task_id: UNBOUND
routing_decision_id: UNBOUND
workflow_instance_id: UNBOUND
stage_id: UNBOUND
role_id: UNBOUND
agent_definition_id/version: UNBOUND
U-POS agent_run_id: UNBOUND
skill_invocation_ref: UNBOUND
context_request_id: UNBOUND
context_bundle_id: UNBOUND
engineering_change_id: UNBOUND
quality_assessment_id: UNBOUND
permission_request_id: UNBOUND
permission_decision_id: UNBOUND
```

Critical rule:
Artist OS product `AgentRun` MUST NOT be treated as U-POS Agent Run solely because the names match.

---

## 10. resource and capability bindings

### Currently concrete project resources

- GitHub repository `unTramp/artistos`;
- canonical/project documentation files;
- PostgreSQL database in local/CI contexts;
- local private storage root;
- CI workflow/check executions;
- web/worker runtime processes.

### U-POS protected capability bindings

Not yet frozen.

Candidate protected capabilities for future binding:
- repository write;
- branch creation/update;
- integration request creation;
- merge;
- migration execution;
- deployment;
- production database mutation;
- secret access;
- external publishing;
- paid spend;
- destructive deletion.

---

## 11. security bindings

Current project controls:
- server-side session validation;
- server-derived artist ownership scope;
- environment validation;
- private local storage abstraction;
- credential-log redaction tests;
- audit/outbox evidence;
- CI read-only contents permission.

U-POS security policy / grants / Permission Decision bindings:
`NOT IMPLEMENTED`.

Production resources and secret-store references:
`UNRESOLVED`.

Raw secret values are forbidden in this manifest.

---

## 12. secret bindings

```text
AUTH_SECRET:
  source: environment
  secret_store_binding_ref: UNRESOLVED for production

DATABASE_URL:
  source: environment
  secret_store_binding_ref: UNRESOLVED for production

future provider tokens:
  source: UNRESOLVED
  secret_store_binding_ref: UNRESOLVED
```

No secret value is recorded.

---

## 13. quality bindings

Evidence-producing commands:
- architecture check;
- lint;
- typecheck;
- unit tests;
- DB integration tests;
- production build;
- Playwright E2E;
- migration/schema generation checks.

Current U-POS Quality Criteria Set:
`UNBOUND`.

Current Quality Assessment/Gate semantics:
`UNBOUND`.

Rule:
CI success may supply Evidence Records later; it does not become a Quality Verdict by itself.

---

## 14. observability bindings

Existing Artist OS operational evidence:
- `traceId`;
- correlation/causation fields;
- structured Pino logs;
- audit events;
- outbox/inbox records;
- durable job state;
- Artist OS product AgentRun records;
- product telemetry events.

U-POS Event/Trace/Span/Metric Definition bindings:
`PARTIALLY MAPPABLE BUT NOT YET FROZEN`.

Product telemetry must not be silently reclassified as U-POS canonical observability semantics.

---

## 15. learning bindings

Artist OS has a **product-domain Learning entity** about what the artist/content/audience system has learned.

U-POS-009 has **organizational learning semantics** about improving the operating system/process.

These are different owners and identities.

```text
artist_os_product_learning → DO NOT AUTO-MAP
upos_organizational_learning → UNBOUND
```

Dogfooding observations belong in `.upos/audit/UPOS_FEEDBACK.md` until reviewed through U-POS governance.

---

## 16. extensions

Candidate namespace:

```text
extensions.artist_os
```

Allowed future extension use:
- product-specific source labels;
- product-domain references;
- non-semantic project metadata.

Extensions MUST NOT override U-POS invariants or Artist OS canonical product facts.

---

## 17. protected areas

Treat as review-sensitive:
- `docs/artist-os/00_governance/`
- database migrations and generated auth schema;
- authentication/actor-scope implementation;
- `packages/core/` domain contracts;
- security/privacy/rights behavior;
- AI acceptance/promotion paths;
- worker/job semantics;
- CI workflow;
- future production/deployment configuration;
- `.upos/` after adoption artifacts become reviewed/frozen.

---

## 18. known project constraints

- single-artist first;
- human-controlled canonical state changes;
- product remains useful with AI disabled;
- modular monolith first;
- no broad architecture rewrite during adoption;
- Advertising/Publicity remain separate research/future boundaries;
- code does not silently overrule MASTER/AR product semantics;
- UNKNOWN is preferred to fabricated binding values;
- no production mutation/deployment is authorized by this audit.

---

## 19. candidate validation state

Schema-level serialization into a machine-readable U-POS Manifest:
`NOT PERFORMED`.

Required before canonical adoption:
1. resolve P1 repository safety issue;
2. reconcile Source-of-Truth status conflicts;
3. independent review of this manifest;
4. assign manifest/project-adapter versions under project governance;
5. validate all REQUIRED bindings for the selected adoption phase;
6. leave future/production bindings unresolved until real owners choose them.
