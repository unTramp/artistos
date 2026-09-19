# Artist OS — Controlled U-POS Migration Plan

**Status:** PLAN ONLY — EXECUTION PROHIBITED BY CURRENT AUDIT DIRECTIVE  
**Source audit baseline:** Artist OS main @ `94ff0e0219bd441b02044f419528b7243b9b318f`  
**U-POS baseline:** `v1.0.0`

## Governing rule

```text
adopt governance and bindings
!=
rewrite Artist OS to look like U-POS
```

No phase begins automatically after this document.

---

# Phase 0 — Audit / Inventory

## objective
Establish evidence-backed current reality and adoption constraints.

## scope
- repository/document/runtime discovery;
- SoT mapping;
- findings/conflicts;
- implementation/document inventory;
- U-POS 01–11 conformance;
- Manifest/Adapter candidates;
- framework feedback;
- operational-proof candidates.

## non-scope
- defect fixes;
- documentation migration;
- product refactor;
- U-POS mutation.

## preconditions
- read access to both repositories;
- U-POS v1.0.0 pinned;
- isolated Artist OS audit branch.

## files affected
`.upos/**` only in this pass.

## risk
LOW; principal risk is incorrect audit inference.

## expected commits
small docs/audit commits by logical artifact.

## validation
- all required files exist;
- counts/status agree across findings, summary, adoption status;
- no Artist OS implementation or U-POS file changed.

## rollback / recovery
delete/revert audit branch commits; main remains untouched.

## completion criteria
All directive audit artifacts complete and independently reviewable.

**Current status:** COMPLETE after final consistency review.

---

# Phase 1 — Governance Foundation

## objective
Make adoption authority explicit before moving project content or creating runtime semantics.

## scope
- independently review audit package;
- resolve B-01 repository safety prerequisite;
- resolve Source-of-Truth metadata conflicts B-02;
- approve project ID/version conventions;
- review/freeze first Project Manifest and Project Adapter;
- establish minimal adoption ownership and change process.

## non-scope
- broad documentation moves;
- Agent runtime;
- C0–C5 engine implementation;
- product-domain redesign;
- production deployment integration.

## preconditions
- audit review accepted;
- owner agrees current architecture baseline is v1.4;
- exact starting revision captured.

## files affected
likely:
- `.gitignore` / narrow guard test or script for security defect;
- selected governance metadata/catalog;
- `.upos/PROJECT_MANIFEST.*`;
- `.upos/PROJECT_ADAPTER.*`;
- `.upos/ADOPTION_STATUS.md`.

## risk
MEDIUM because source authority and repository security become operational.

## expected commits
- security hygiene fix;
- documentation authority reconciliation;
- manifest/adapter review amendments;
- governance freeze record.

## validation
- exact-head CI/check evidence;
- no product semantics changed;
- all open authority conflicts targeted by phase are resolved;
- secrets/private data not exposed.

## rollback / recovery
revert individual governance/security commits; preserve audit evidence.

## completion criteria
- B-01/B-02/B-03/B-04/B-05 cleared or explicitly scoped;
- Manifest/Adapter have reviewed versions;
- no ambiguous current MASTER resolution.

---

# Phase 2 — Documentation Reconciliation

## objective
Apply U-POS-01 lifecycle/ownership discipline to Artist OS documentation without mass migration.

## scope
- authoritative document catalog;
- owner/status/normativity/lifetime for high-authority docs;
- reconcile v1.3/AR/freeze metadata;
- classify plans vs historical evidence;
- add missing phase closure evidence where useful;
- automated docs integrity checks.

## non-scope
- rewriting MASTER;
- renumbering product requirements;
- moving all 20 domain specs;
- changing feature semantics.

## preconditions
Phase 1 authority model frozen.

## files affected
primarily `docs/artist-os/**`, governance catalog/check tooling.

## risk
MEDIUM: bad metadata can change agent authority resolution.

## expected commits
separate commits for catalog, metadata reconciliations, integrity automation, retrospective evidence.

## validation
- one current canonical owner per audited scope;
- no broken requirement links;
- generated docs remain derived;
- source conflicts reduce to zero or explicitly owner-blocked;
- independent Documentation Guardian review.

## rollback / recovery
revert metadata/catalog changes; original historical artifacts remain in Git history.

## completion criteria
A new agent can resolve current/historical/supporting docs deterministically.

---

# Phase 3 — Project Bindings

## objective
Turn the reviewed Manifest/Adapter into usable U-POS-011 bindings for the current engineering environment.

## scope
- repository/provider refs;
- path bindings;
- GitHub branch/PR/check refs;
- command bindings;
- local/CI environment bindings;
- first identity/reference mappings;
- binding validation/health;
- explicit unresolved production bindings.

## non-scope
- fake production values;
- U-POS runtime orchestration;
- product AgentRun/Context entity reuse.

## preconditions
Phase 1/2 governance stable.

## files affected
`.upos/` machine-readable/configuration forms and narrow validation tooling.

## risk
MEDIUM due to semantic namespace collisions.

## expected commits
adapter schema/config, validation, provider binding tests.

## validation
- incompatible/missing REQUIRED bindings fail closed;
- product-vs-U-POS homonyms cannot auto-map;
- repository/command refs resolve;
- historical adapter version remains reproducible.

## rollback / recovery
restore previous adapter/manifest version.

## completion criteria
U-POS abstractions can resolve project mechanics without redefining product facts.

---

# Phase 4 — Engineering Governance Adoption

## objective
Represent a bounded Artist OS repository change through U-POS-002/003/004/006 semantics.

## scope
- minimal engineering Role contracts;
- Implementer/Reviewer separation;
- initial Skill definitions;
- C0–C5 classification + work type/concerns;
- one base engineering workflow;
- Engineering Change / Repository Change Unit refs;
- GitHub Integration Request bindings;
- exact check refs.

## non-scope
- generalized agent swarm;
- every possible workflow/skill;
- merge automation;
- production actions.

## preconditions
Project bindings validated.

## files affected
project-side `.upos/` governance/runtime config and minimal supporting tooling.

## risk
MEDIUM.

## expected commits
roles/skills, routing/workflow, engineering binding, tests.

## validation
dry-run or bounded non-destructive proof; independent review; no automatic merge.

## rollback / recovery
disable new routing/config and return to project-native process; repository changes remain standard Git artifacts.

## completion criteria
one bounded change can be traced Task → Routing → Workflow → Context → Engineering artifacts → independent review.

---

# Phase 5 — Quality / Security / Observability Integration

## objective
Convert existing strong project controls into governed U-POS interfaces without duplicating them.

## scope
- Quality Policy/Criteria Set for first workflow;
- check results → Evidence Records;
- exact-target Assessment/Verdict;
- repository/migration/merge protected actions;
- Permission Request/Decision for selected capabilities;
- event/trace capture for operational proof;
- minimal Control Plane read model;
- dogfooding feedback intake.

## non-scope
- production permission model before production resources exist;
- rewriting CI;
- treating logs as truth;
- silent learning promotion.

## preconditions
Phase 4 workflow identity exists.

## files affected
`.upos/`, narrow CI/evidence adapters, observability read models.

## risk
MEDIUM to HIGH depending on permission enforcement.

## expected commits
quality evidence adapter, security policy/bindings, observability capture/read model.

## validation
- CI green cannot produce PASS without Assessment;
- non-ALLOW protected action cannot execute;
- exact target refs retained;
- dashboard/read model can be rebuilt from owner records;
- no product Learning/AgentRun identity collision.

## rollback / recovery
disable U-POS enforcement/read model separately; preserve underlying CI/auth/Git behavior.

## completion criteria
first Operational Proof can produce independent Quality/Security/Observability evidence.

---

# Phase 6 — U-POS Runtime Integration

## objective
Run a complete governed project task end to end when the project actually needs/runtime supports it.

## scope
```text
Task
→ Classification
→ Routing Decision
→ Workflow Instance
→ Context Request/Bundle
→ Agent Run / Skill Invocation
→ implementation
→ independent review
→ Quality
→ Security where required
→ merge readiness
→ engineering integration
→ Observability
→ Learning intake
```

## non-scope
- autonomous main merge unless separately authorized;
- production deployment unless provider/resources/security policy are real;
- U-POS self-modification;
- product-domain behavior changes unrelated to the selected task.

## preconditions
Phases 1–5 complete for required interfaces; Operational Proof selected and approved.

## files affected
runtime/config depends on reviewed implementation design; currently UNRESOLVED.

## risk
HIGHER; cross-module execution semantics become active.

## expected commits
small runtime slices, evidence instrumentation, proof task changes.

## validation
- exact identity/provenance chain;
- independent reviewer;
- quality/security results;
- no unresolved required binding;
- recoverable failure path;
- post-run audit and feedback.

## rollback / recovery
stop/disable orchestration, revert proof change where necessary, preserve immutable evidence.

## completion criteria
one or more approved Operational Proof tasks complete with reconstructable end-to-end evidence and no silent semantic substitutions.

---

# Migration-wide non-negotiables

- U-POS v1.0.0 remains unchanged.
- Artist OS MASTER/product semantics remain owned by Artist OS.
- No mass file move merely for visual conformance.
- No product AgentRun/Learning/Context/Decision identity reuse for U-POS without explicit semantic mapping.
- No secret/raw credential in manifest/audit.
- No production action from unresolved bindings.
- no `CI green == Quality PASS`.
- every phase is independently reviewable and revertible.
- STOP after this audit until independent review authorizes Phase 1.
