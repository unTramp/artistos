# Artist OS — Project Adapter Candidate

**Status:** CANDIDATE / NOT YET CANONICAL  
**Project:** artist-os  
**Project Manifest version:** candidate-0.1  
**Project Adapter version:** candidate-0.1  
**U-POS baseline:** v1.0.0

## 0. Mission

Bind U-POS universal governance/engineering semantics to Artist OS without changing either system's meaning.

```text
U-POS universal semantics
+ Artist OS Project Adapter
+ Artist OS Project Manifest
+ canonical Artist OS project knowledge
= project-configured U-POS
```

This adapter is not the Artist OS Product Architecture.

---

# 1. Anti-corruption boundary

Hard rules:

```text
U-POS concept != Artist OS product concept merely because names match
Project binding != domain ownership
Executable command != policy
CI result != Quality Verdict
GitHub permission != U-POS Permission Decision
Product telemetry != project canonical truth
Product Learning != U-POS organizational Learning
Product AgentRun != U-POS Agent Run
Product Context Pack != U-POS Context Bundle
Product Decision Memory != project-governance decision record
```

---

# 2. Namespace collision rules

Artist OS is itself an AI/knowledge product. Therefore semantic homonyms MUST carry explicit namespace/type identity.

Recommended conceptual names in adoption artifacts:

| Artist OS product semantic | U-POS semantic |
|---|---|
| `artist.product.AgentRun` | `upos.execution.AgentRun` |
| `artist.product.ContextPack` | `upos.execution.ContextBundle` |
| `artist.product.Learning` | `upos.learning.LearningCandidate/Outcome` |
| `artist.product.Decision` | `upos.governance/owner decision refs` |
| `artist.product.OperationalAction` | U-POS Workflow/Engineering action references |
| `artist.product.AuditEvent` | U-POS Observability/Audit projection semantics |
| `artist.product.AgentConfiguration` | U-POS Agent Definition/runtime binding only if explicitly mapped |

No automatic conversion is authorized.

---

# 3. repository bindings

```text
project_repository:
  ref: artist-os-primary
  provider: GitHub
  repository: unTramp/artistos
  canonical_branch: main

audit_workspace:
  branch: feat/upos-adoption
  purpose: U-POS first-pass audit/adoption artifacts

framework_repository:
  provider: GitHub
  repository: unTramp/upos
  baseline: v1.0.0
  access: READ_ONLY
```

Future GitHub Integration Request/merge bindings:
`NOT YET FROZEN`.

---

# 4. path bindings

## Project truth

```text
architecture_truth:
  docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md

companion_architecture:
  docs/artist-os/00_governance/ARCHITECTURE_RESOLUTION_PASS1.md

documentation_index:
  docs/artist-os/README.md

product_guidance:
  docs/artist-os/PRODUCT_PRINCIPLES.md

ux_truth:
  docs/artist-os/UX_VISUAL_DIRECTION.md

engineering_contracts:
  docs/artist-os/engineering/

plans_and_historical_evidence:
  docs/artist-os/implementation/
```

Authority conflicts are resolved only through `.upos/SOURCE_OF_TRUTH_MAP.md` plus the canonical owner; path presence alone is insufficient.

## Implementation

```text
web: apps/web/
worker: apps/worker/
domain_application: packages/core/
database: packages/db/
infrastructure: packages/infrastructure/
product_ai: packages/ai/
e2e: tests/e2e/
ci: .github/workflows/ci.yml
```

---

# 5. command bindings

| U-POS-facing capability | Project command | Binding status |
|---|---|---|
| architecture static check | `pnpm arch:check` | AVAILABLE evidence producer |
| lint | `pnpm lint` | AVAILABLE evidence producer |
| typecheck | `pnpm typecheck` | AVAILABLE evidence producer |
| unit verification | `pnpm test` | AVAILABLE evidence producer |
| DB integration verification | `pnpm test:integration` | AVAILABLE evidence producer |
| build | `pnpm build` | AVAILABLE evidence producer |
| browser E2E | `pnpm test:e2e` | AVAILABLE evidence producer |
| DB migration | `pnpm db:migrate` | AVAILABLE mechanic; permission/policy binding unresolved |
| development startup | `pnpm dev` | AVAILABLE |
| deployment | UNRESOLVED | UNBOUND |
| production rollback | UNRESOLVED | UNBOUND |

Mechanic availability does not grant authority to run it.

---

# 6. tool bindings

Known usable project tool/provider:
- GitHub repository API/provider.

Audit limitation:
The current environment had repository access through the GitHub connector but no network-capable local checkout. Therefore no local command execution result is bound by this audit.

Future normal developer/agent environment:
`UNRESOLVED AS U-POS TOOL BINDING`.

---

# 7. documentation source bindings

Authority resolution:

```text
MASTER v1.4
→ AR-001…AR-062 companion contracts
→ approved Full Product Specs
→ Engineering Specs
→ implementation plans
→ implementation detail
```

Special overlays:
- Product Principles guide product priority/surface.
- UX Visual Direction governs presentation where it does not conflict with canonical product/domain semantics.
- historical completion/audit reports are evidence, not current authority.

Conflict behavior:
```text
active canonical conflict
→ no silent compromise
→ OWNER DECISION / DOCUMENTATION GOVERNANCE reconciliation
```

---

# 8. runtime bindings

| Abstract capability | Artist OS binding | State |
|---|---|---|
| web application runtime | Next.js `apps/web` | BOUND |
| worker runtime | `apps/worker` | BOUND foundation |
| relational store | PostgreSQL 17 | BOUND local/CI |
| vector support | pgvector | BOUND capability only |
| migrations | Drizzle migrations | BOUND |
| auth | Better Auth | BOUND |
| storage | LocalStorageProvider | BOUND development |
| production object storage | — | UNRESOLVED |
| product AI | disabled/mock adapters | BOUND limited |
| live product AI | — | UNRESOLVED |
| queue | PostgreSQL job table/queue | BOUND foundation |
| deployment runtime | — | UNRESOLVED |

---

# 9. CI bindings

Provider:
GitHub Actions.

Workflow:
`.github/workflows/ci.yml`.

Configured evidence chain:
```text
install
→ migrate
→ Better Auth schema drift check
→ architecture check
→ lint
→ typecheck
→ unit
→ integration
→ build
→ Playwright E2E
```

Binding rule:
- provider check/run refs may later become Engineering Check/Evidence references;
- no automatic `CI green → Quality PASS`.

Current exact audited revision evidence:
`NEEDS EVIDENCE`.

---

# 10. identity bindings

Artist OS server identity:
- Better Auth user;
- artist membership;
- server-resolved Artist scope.

Project repository identity:
- GitHub repository/ref/commit SHA.

U-POS Role/Agent/Workflow identities:
`UNBOUND`.

Future binding requirement:
Every U-POS execution record must retain its own identity and may reference, but never reuse, a product-domain AgentRun ID as its semantic identity.

---

# 11. environment bindings

### development
Bound to project README + `.env.example` + Docker Compose.

### test/CI
Bound to GitHub Actions + disposable PostgreSQL.

### production
UNRESOLVED.

Fail-closed rule:
No production action, secret, deployment or database mutation permission may be inferred from the existence of local/CI commands.

---

# 12. quality evidence bindings

Potential evidence producers:
- lint execution;
- typecheck execution;
- architecture check execution;
- unit test execution;
- integration test execution;
- build execution;
- E2E execution;
- migration drift/schema generation checks;
- future manual smoke evidence.

Not yet defined:
- U-POS Quality Policy;
- Criteria Set;
- Evidence Record normalization;
- Assessment;
- Verdict;
- Gate;
- exception/waiver handling.

---

# 13. security resource bindings

Candidate resources for later explicit binding:

```text
repository
canonical branch
audit/adoption branch
governance documents
database
migration history
auth configuration
secret environment
local/private storage
future production database
future production storage
future deployment target
external provider credentials
publishing endpoints
paid-spend endpoints
```

Current project auth checks are product/runtime controls, not a U-POS permission engine.

---

# 14. observability bindings

Existing signals available for later adapter mapping:
- traceId;
- correlationId / causationId;
- structured logs;
- audit_events;
- outbox_events / consumer inbox;
- jobs and job state;
- product AgentRun;
- product telemetry.

Binding health:
`PARTIAL`.

Missing:
- U-POS capture policy;
- Event semantic mapping;
- Trace/Span identity rules;
- governed Metric Definitions;
- Control Plane read model.

---

# 15. learning-related project bindings

Artist OS product Learning:
- canonical product/domain entity;
- governs artist/content learnings.

U-POS Learning:
- operating-system improvement process.

Adoption feedback route:

```text
Artist OS observation
→ .upos/audit/UPOS_FEEDBACK.md
→ later U-POS-009 / project governance review
→ possible proposal
→ canonical owner process
```

Direct mutation of U-POS from project evidence is prohibited.

---

# 16. agent organization binding

Artist OS currently defines product agents such as Orchestrator/Research/Strategy/Production/Analytics/Brand Guard in product architecture.

These MUST NOT be assumed to be U-POS engineering roles.

Candidate U-POS project roles to bind later:
- Orchestrator;
- Implementer;
- Final Reviewer;
- QA;
- Security Reviewer where concern applies;
- Documentation Guardian;
- Merge Controller.

No Agent Definition versions are frozen by this audit.

---

# 17. skills binding

No project U-POS Skill Registry exists.

Candidate reusable skills for a later phase:
- repository discovery;
- documentation authority resolution;
- architecture conformance review;
- TypeScript implementation;
- test execution/evidence capture;
- PR review;
- security hygiene review;
- documentation reconciliation.

Names are illustrative only and not canonical registrations.

---

# 18. workflow binding

No U-POS C0–C5 routing runtime exists.

Candidate first adoption workflow:
```text
Task
→ classify change/work type/concerns
→ resolve sources
→ isolated branch/workspace
→ implementation
→ independent review
→ quality evidence
→ security review when applicable
→ merge-readiness result
```

No merge execution is authorized by this audit.

---

# 19. binding failures / fail-closed rules

The following MUST resolve to unavailable/blocked rather than guessed:
- production target;
- production secret store;
- live AI provider;
- U-POS permission policy;
- U-POS role authority;
- merge authority;
- Quality Verdict;
- current CI run when no exact run ref exists;
- canonical owner when a registered Source-of-Truth conflict affects the action.

---

# 20. adapter validation status

```text
repository/path discovery: PASS for audited scope
canonical source resolution: PASS WITH OPEN METADATA CONFLICTS
command discovery: PASS
local/CI runtime binding: PASS
production runtime binding: UNRESOLVED
quality semantic binding: PARTIAL
security semantic binding: PARTIAL
observability semantic binding: PARTIAL
learning semantic binding: PARTIAL
agent/workflow/skill binding: NOT IMPLEMENTED
namespace collision protection: CANDIDATE RULE DEFINED HERE
machine-readable schema validation: NOT PERFORMED
```

This candidate must undergo independent review before it becomes an active adapter.
