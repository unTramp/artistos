# Artist OS — Target Documentation Architecture

**Status:** PROPOSAL ONLY — DO NOT MIGRATE IN THIS PASS

## 0. Design goal

Adopt U-POS Documentation governance without making Artist OS documentation visually resemble the U-POS repository.

The target must preserve:
- Artist OS product/domain semantics;
- current requirement IDs and MASTER traceability;
- v1.4 freeze/history;
- current domain-spec organization;
- engineering contracts;
- UX doctrine;
- implementation history.

The primary change is **authority/lifecycle metadata and cataloging**, not a mass folder move.

---

# 1. Governing principle

```text
one fact
→ one canonical owner
→ one canonical source
→ references elsewhere
→ explicit derived/evidence/history classifications
```

Artist OS remains canonical for Artist OS product facts.

`.upos/` remains a binding/governance layer, not a second product documentation tree.

---

# 2. Target logical authority layers

## A. Governance / architecture constitution

Keep:
`docs/artist-os/00_governance/`

Owns:
- current MASTER architecture;
- architecture freeze decisions;
- ACP/AR decisions and companion contracts;
- documentation standard/catalog;
- source-of-truth conflict resolution.

Recommended future addition:
`DOCUMENT_CATALOG.md` or a machine-readable equivalent.

It should record for every authority-bearing document:
- stable document ID;
- canonical owner;
- status;
- normativity;
- lifetime;
- supersedes/superseded-by;
- canonical scope;
- last reviewed;
- review trigger;
- current repository path.

This catalog should be authoritative for current lifecycle/status metadata when a historical artifact's internal header must remain preserved.

## B. Product/domain truth

Preserve the existing 20-domain Full Product Spec layout.

Do not reorganize it merely to match U-POS Level numbers.

Each normative feature spec should expose:
- owner;
- stable requirement IDs;
- MASTER/AR references;
- status/lifetime;
- conflicts/dependencies;
- implementation/evidence links where appropriate.

## C. Product principles

Keep:
`docs/artist-os/PRODUCT_PRINCIPLES.md`

Classification:
- living product guidance;
- subordinate to MASTER/AR;
- not a substitute for feature/domain contracts.

## D. UX / experience truth

Keep:
`docs/artist-os/UX_VISUAL_DIRECTION.md`
and feature-specific UX specs where they already belong.

Explicitly separate:
- durable UX doctrine;
- design-system/component contracts;
- current redesign/migration plans;
- visual QA evidence.

## E. Engineering contracts

Keep:
`docs/artist-os/engineering/`

Engineering specs remain derived from approved product/domain architecture.

They should link to exact upstream requirement/decision identities and exact validation/evidence targets.

## F. Quality/testing evidence

Do not bury durable test policy inside implementation completion reports.

Future logical owner should include:
- test strategy;
- requirement→test mapping;
- quality criteria/policy once U-POS-007 is adopted;
- exact-revision evidence refs;
- historical assessment/results.

Physical path may be selected later; no move is performed now.

## G. Operations

Separate durable operations contracts from setup prose:
- environment model;
- deployment;
- migration/rollback;
- backup/recovery;
- production access;
- incident/runbook material.

Current production bindings remain unresolved.

## H. Decisions

Architecture/product decisions should have durable decision records distinct from:
- Artist OS **product Decision Memory** entity;
- temporary implementation plans;
- U-POS execution decisions.

Namespace/owner must be explicit.

## I. Plans/current execution

Current implementation plans remain TEMPORARY/LIVING:
- Phase plans;
- UI redesign sequence;
- migration plan.

They should declare closure/supersession and never become permanent doctrine by age.

## J. Reference/research

Courses, platform research, imported guidance and external references remain supporting evidence with:
- authority;
- freshness;
- claim type;
- promotion status.

## K. Archive/history

Preserve superseded architecture and point-in-time audits.

A historical file does not need to be rewritten to erase history if the canonical catalog unambiguously marks:
- HISTORICAL/SUPERSEDED;
- successor;
- last period of authority.

---

# 3. Proposed logical view

This is a logical ownership map, **not a required immediate folder tree**:

```text
docs/artist-os/
├── 00_governance/          # constitution, freeze, AR/ACP, catalog
├── [existing domain specs] # preserve current product/domain organization
├── PRODUCT_PRINCIPLES.md
├── UX_VISUAL_DIRECTION.md
├── engineering/
├── implementation/         # plans + completion evidence, classified by metadata
└── [future logical owners as needed]
    ├── quality/
    ├── operations/
    ├── decisions/
    ├── reference/
    └── archive/
```

Do not create empty directories merely to satisfy the model.

---

# 4. Required metadata model

For important documents, future governance should support:

```text
document_id
title
owner
type
status
normativity
lifetime
canonical_scope
version
supersedes?
superseded_by?
effective_from?
effective_until?
related_requirements[]
related_decisions[]
implementation_refs[]
review_trigger
last_reviewed
```

Suggested lifetimes:
`STABLE | LIVING | TEMPORARY | HISTORICAL`.

Suggested document lifecycle:
`DRAFT → REVIEW → APPROVED → ACTIVE → DEPRECATED → SUPERSEDED → ARCHIVED`.

Product entity/status lifecycles remain separate.

---

# 5. Conflict handling

A future documentation checker should detect at minimum:
- two ACTIVE canonical owners for one scope;
- current document referencing superseded architecture as authoritative;
- normative companion marked PROPOSED after freeze;
- temporary plan without closure status after implementation;
- broken references;
- derived/compiled output committed as canonical source;
- stale "current" statements in historical documents;
- generated copy being manually edited.

It must report conflict, not silently select by file modification time.

---

# 6. U-POS integration boundary

Project documentation:
`docs/artist-os/**`
continues to own Artist OS product truth.

Project-side U-POS:
`.upos/**`
owns only:
- adoption/binding configuration;
- conformance/audit artifacts;
- operational project governance records once adopted.

Never:
- copy U-POS module source trees into Artist OS;
- rename Artist OS domains to U-POS modules;
- move product specs under `.upos/`;
- allow Project Adapter to define Artist OS product facts.

---

# 7. Migration strategy implied by this target

1. establish authoritative document catalog;
2. classify existing high-authority docs without moving them;
3. reconcile stale status metadata;
4. identify plans/evidence/history explicitly;
5. add automated consistency checks;
6. only then evaluate whether physical path changes provide actual value.

Physical mass migration is not recommended as the first documentation-adoption action.

---

# 8. Acceptance criteria for future documentation migration

- v1.4 remains unambiguously current;
- v1.3 remains preserved as historical architecture;
- AR-001…AR-062 status is unambiguous;
- requirement IDs remain stable;
- no product/domain ownership changes;
- generated compiled docs remain derived;
- plans cannot outrank durable contracts;
- historical audits remain available;
- all changed references validate;
- a new agent can resolve canonical source without guessing;
- `.upos/` remains a binding layer, not duplicate Artist OS documentation.
