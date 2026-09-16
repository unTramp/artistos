# Artist OS — Product Documentation Workspace

This workspace expands `MASTER_ARCHITECTURE_v1.3.md` into implementation-ready product specifications without changing the frozen architecture.

## Source-of-truth hierarchy

1. `00_governance/MASTER_ARCHITECTURE_v1.3.md` — normative architecture and product constitution.
2. `00_governance/DOCUMENTATION_STANDARD.md` — mandatory format for detailed feature specifications.
3. Domain/feature specs — detailed product behavior, workflows, UX, AI behavior, states, rules, telemetry, edge cases and acceptance criteria.
4. `COMPILED_FULL_PRODUCT_SPEC.md` — generated reading copy; never edit it manually.
5. Engineering implementation specs — derived from approved product specs, not the other way around.

## Editing model

- One directory per bounded context / product domain.
- One file per meaningful feature or workflow.
- Do not create a directory per button or tiny action.
- Every normative requirement gets a stable requirement ID.
- Every detailed feature links back to MASTER v1.3 requirement numbers.
- If a detailed spec conflicts with MASTER v1.3, MASTER wins until an explicit architecture change is approved.

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
- 90 have proposed architecture resolutions; 45 route to Engineering, 38 to Calibration/Evals, 26 to UX/Product Policy, 4 remain intentionally Deferred.
- 6 ACPs + 62 architecture contracts form the current Architecture Freeze Candidate.
- Engineering Specification Pass 1 has started (`engineering/`).

See:

- [`00_governance/SPEC_PROGRESS.md`](00_governance/SPEC_PROGRESS.md)
- [`00_governance/CROSS_DOMAIN_RECONCILIATION_PASS1.md`](00_governance/CROSS_DOMAIN_RECONCILIATION_PASS1.md)
- [`00_governance/OPEN_QUESTIONS_REGISTRY.md`](00_governance/OPEN_QUESTIONS_REGISTRY.md)
- [`00_governance/ARCHITECTURE_GAP_CLASSIFICATION.md`](00_governance/ARCHITECTURE_GAP_CLASSIFICATION.md)
- [`00_governance/OPEN_QUESTIONS_RESOLUTION_TRACKER.md`](00_governance/OPEN_QUESTIONS_RESOLUTION_TRACKER.md)
- [`00_governance/ARCHITECTURE_RESOLUTION_PASS1.md`](00_governance/ARCHITECTURE_RESOLUTION_PASS1.md)
- [`00_governance/ARCHITECTURE_FREEZE_CANDIDATE.md`](00_governance/ARCHITECTURE_FREEZE_CANDIDATE.md)
- [`engineering/00_ENGINEERING_SPEC_INDEX.md`](engineering/00_ENGINEERING_SPEC_INDEX.md)
