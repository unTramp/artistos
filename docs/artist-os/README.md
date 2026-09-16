# Artist OS — Product Documentation Workspace

This workspace expands `MASTER_ARCHITECTURE_v1.4.md` into implementation-ready product specifications while preserving `MASTER_ARCHITECTURE_v1.3.md` as the previous frozen architecture.

## Source-of-truth hierarchy

1. `00_governance/MASTER_ARCHITECTURE_v1.4.md` — normative architecture and product constitution after the v1.4 freeze PR is merged.
2. `00_governance/ARCHITECTURE_RESOLUTION_PASS1.md` — normative companion contracts AR-001…AR-062 for v1.4.
3. `00_governance/DOCUMENTATION_STANDARD.md` — mandatory format for detailed feature specifications.
4. Domain/feature specs — detailed product behavior, workflows, UX, AI behavior, states, rules, telemetry, edge cases and acceptance criteria.
5. `COMPILED_FULL_PRODUCT_SPEC.md` — generated reading copy; never edit it manually.
6. Engineering implementation specs — derived from approved product specs and architecture, not the other way around.

## Editing model

- One directory per bounded context / product domain.
- One file per meaningful feature or workflow.
- Do not create a directory per button or tiny action.
- Every normative requirement gets a stable requirement ID.
- Existing MASTER §1–464 numbering remains stable across v1.3 → v1.4; new architecture additions use letter-suffixed identifiers where needed to preserve traceability.
- Every detailed feature links back to MASTER requirement numbers.
- If a detailed spec conflicts with MASTER v1.4, MASTER wins until an explicit architecture change is approved.

## Status lifecycle

`DRAFT → REVIEW → APPROVED → IMPLEMENTING → IMPLEMENTED → VERIFIED`

## Definition of "specified"

A feature is not considered specified until its document covers: purpose, user problem, entry points, dependencies, data, main flow, alternatives, states, actions, business rules, AI behavior, approvals, validations, empty/error/loading states, edge cases, cross-module effects, telemetry, learning feedback, permissions, non-goals and acceptance criteria.

## Current detailed-spec progress

**First full detailed product-spec pass is complete across all 20 domains.**

- 181 feature specification targets in the workspace.
- **2,334 stable product requirements** after the first full pass.
- Cross-domain ownership / E2E reconciliation completed.
- 203 feature/schema questions extracted with corrected parser and fully routed for explicit resolution.
- 90 architecture resolutions were reviewed; 45 route to Engineering, 38 to Calibration/Evals, 26 to UX/Product Policy, 4 remain intentionally Deferred.
- 6 ACPs are incorporated by the v1.4 freeze; 62 AR contracts become the normative companion architecture layer.
- Engineering Specification Pass 1 covers documents 01–15; the next pass rebases ACP-dependent PROVISIONAL references onto frozen MASTER v1.4 and performs consistency/traceability review.

See:

- [`00_governance/MASTER_ARCHITECTURE_v1.4.md`](00_governance/MASTER_ARCHITECTURE_v1.4.md)
- [`00_governance/MASTER_ARCHITECTURE_v1.3.md`](00_governance/MASTER_ARCHITECTURE_v1.3.md)
- [`00_governance/MASTER_v1.3_TO_v1.4_DELTA.md`](00_governance/MASTER_v1.3_TO_v1.4_DELTA.md)
- [`00_governance/ARCHITECTURE_REVIEW_PASS2.md`](00_governance/ARCHITECTURE_REVIEW_PASS2.md)
- [`00_governance/ARCHITECTURE_RESOLUTION_PASS1.md`](00_governance/ARCHITECTURE_RESOLUTION_PASS1.md)
- [`00_governance/SPEC_PROGRESS.md`](00_governance/SPEC_PROGRESS.md)
- [`00_governance/CROSS_DOMAIN_RECONCILIATION_PASS2.md`](00_governance/CROSS_DOMAIN_RECONCILIATION_PASS2.md)
- [`engineering/00_ENGINEERING_SPEC_INDEX.md`](engineering/00_ENGINEERING_SPEC_INDEX.md)
