# Artist OS — Source of Truth Map

Audit baseline: main @ 94ff0e0219bd441b02044f419528b7243b9b318f

## Resolution rule established by repository evidence

Current intended hierarchy:

1. MASTER_ARCHITECTURE_v1.4.md — canonical architecture/product constitution.
2. AR-001…AR-062 in ARCHITECTURE_RESOLUTION_PASS1.md — normative companion semantics where non-conflicting with MASTER v1.4.
3. Full Product Specs / approved product-domain requirements.
4. Engineering specs.
5. implementation plans and code-level choices.
6. historical audits/completion reports as evidence, not current truth.

Product Principles and UX Visual Direction guide prioritization/presentation within that hierarchy and cannot silently rewrite domain ownership.

Important conflict: two older files retain stale self-metadata. See audit/CONFLICT_REGISTER.md.

## Area map

| Area | Canonical owner/source | Classification | Notes |
|---|---|---|---|
| Product vision/principles | MASTER v1.4 + PRODUCT_PRINCIPLES.md | CANONICAL | principles subordinate to frozen architecture |
| Domain model | MASTER v1.4 + AR-001…AR-062 + approved domain specs | CANONICAL | AR file has stale PROPOSED header; conflict registered |
| Architecture | MASTER v1.4 + engineering architecture contracts | CANONICAL / DERIVED | v1.4 freeze merged in PR #4 |
| Feature specifications | approved Full Product Specs | CANONICAL beneath MASTER/AR | 20-domain corpus per docs index |
| UX / IA | MASTER UX requirements + UX_VISUAL_DIRECTION.md + approved feature specs | CANONICAL/DERIVED | presentation cannot create domain semantics |
| Design System | UX_VISUAL_DIRECTION.md + current design-system implementation | LIVING | current shared tokens/primitives established by PR #34 |
| Engineering | docs/artist-os/engineering/* | DERIVED NORMATIVE | implementation constrained by MASTER/AR |
| API / Data | engineering specs + packages/core contracts + packages/db schema/migrations | DERIVED + EXECUTABLE | code is evidence, not authority to rewrite product semantics |
| AI behavior | MASTER/AR/product specs + engineering AI spec + packages/ai/web adapters | CANONICAL → DERIVED | current live provider capability is absent |
| Security / Privacy / Rights | MASTER §§383–391 + engineering security spec + current auth/storage/logging controls | CANONICAL → DERIVED | U-POS permission layer not yet bound |
| Quality / Testing | MASTER §§396–402 + engineering testing spec; CI/tests are evidence mechanisms | CANONICAL → EXECUTABLE EVIDENCE | CI success is not itself U-POS Quality PASS |
| Analytics / Telemetry | MASTER analytics/telemetry requirements + product telemetry implementation | CANONICAL → PARTIAL IMPLEMENTATION | current telemetry is product telemetry, not U-POS observability |
| Operations | engineering operations spec + root README + CI/runtime config | DERIVED/LIVING | production hosting/deploy target remains UNRESOLVED |
| Decisions | MASTER Decision Memory semantics + canonical Decision entities for product decisions; architecture freeze/ACP artifacts for architecture decisions | CANONICAL by decision type | do not merge product Decision Memory with project-governance decisions |
| Plans | docs/artist-os/implementation/* plans | TEMPORARY | never promoted to doctrine by age |
| Reference material | course/research/reference docs subject to ResearchClaim governance | SUPPORTING | authority/freshness rules apply |
| Archive | v1.3 and superseded/historical artifacts | HISTORICAL | archival metadata must not compete with current sources |

## Explicit source conflicts

### v1.3 canonicality
MASTER_ARCHITECTURE_v1.3.md still self-identifies as Current Master Source of Truth.
Repository README, docs README, MASTER v1.4 and merged PR #4 establish v1.4 as current.
Resolution for this audit: v1.4 is used as current canonical baseline; the contradictory v1.3 self-header is recorded, not silently edited.

### AR status
ARCHITECTURE_RESOLUTION_PASS1.md says PROPOSED and v1.3 authoritative.
MASTER v1.4 and docs README say AR-001…AR-062 are normative companion contracts.
Resolution for this audit: use the v1.4 freeze decision as stronger/later authority and record the stale AR self-metadata as a conflict requiring governance reconciliation.

## Unknown / unresolved values

These are unresolved values inside otherwise identifiable owner domains, not unidentified Source-of-Truth areas:
- production hosting/deployment provider and environment identifiers;
- live AI provider/model binding;
- U-POS project policy bindings, because this pass creates candidates only;
- current audited-commit CI run result through the available connector.

## Rule for future agents

When a conflict remains active:
- do not average or merge claims;
- resolve through the canonical owner;
- preserve the conflict and evidence;
- stop any change whose correctness depends on the unresolved fact.

Code may reveal drift; code does not automatically become the product constitution.
