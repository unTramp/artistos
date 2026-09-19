# Artist OS — U-POS Adoption Workspace

Status: AUDIT-ONLY FIRST PASS
Project: Artist OS
Project repository: unTramp/artistos
Audit branch: feat/upos-adoption
Audited project baseline: main @ 94ff0e0219bd441b02044f419528b7243b9b318f
U-POS repository: unTramp/upos
U-POS canonical baseline: v1.0.0 @ 911b36ee25ae4d523071a24225e407592a6c2735
Audit date: 2026-09-20

## Boundary

This directory is the project-side binding and evidence workspace for the first U-POS dogfooding pass.

U-POS remains universal governance / engineering semantics.
Artist OS remains the concrete product, domain, implementation and product knowledge.
The Project Adapter is the anti-corruption layer between those systems.

Nothing in this directory changes Artist OS product semantics, silently changes U-POS semantics, or authorizes migration.

## Audit package

- PROJECT_MANIFEST.md — human-readable project manifest candidate.
- PROJECT_ADAPTER.md — candidate U-POS-to-Artist-OS binding layer.
- SOURCE_OF_TRUTH_MAP.md — canonical ownership map.
- ADOPTION_STATUS.md — U-POS 01–11 adoption status.
- MIGRATION_PLAN.md — controlled migration plan; not executed.
- audit/EXECUTIVE_AUDIT_SUMMARY.md — executive assessment.
- audit/PROJECT_FINDINGS.md — evidence-backed findings register.
- audit/CONFLICT_REGISTER.md — active documentation/authority conflicts.
- audit/DOCUMENT_INVENTORY.md — important documentation inventory.
- audit/IMPLEMENTATION_INVENTORY.md — implementation/runtime inventory.
- audit/U_POS_CONFORMANCE_MATRIX.md — module/capability conformance.
- audit/TARGET_DOCUMENTATION_ARCHITECTURE.md — proposed future docs architecture.
- audit/UPOS_FEEDBACK.md — dogfooding observations and framework candidates.
- audit/OPERATIONAL_PROOF_CANDIDATES.md — bounded future operational proofs.

## Evidence policy

The audit distinguishes:
- Artist OS product/domain truth from U-POS operating-system truth.
- code existence from verified runtime behavior;
- CI configuration from a current Quality PASS;
- historical completion reports from current independent evidence;
- product AgentRun/Context/Learning/Decision concepts from U-POS execution/governance concepts.

UNKNOWN, UNRESOLVED, NEEDS EVIDENCE and OWNER DECISION REQUIRED are intentionally retained where evidence is insufficient.

## Execution limitation

The GitHub connector provided repository read/write access but no executable repository checkout. Network cloning from the local sandbox was unavailable. Therefore this pass inspected repository files, PR/commit evidence and CI definitions, but did not independently run pnpm install, migrations, lint, typecheck, tests or build against the audited commit.

The current main merge commit also did not expose a workflow run through the available GitHub connector. Historical PR/completion-report claims are treated as supporting evidence, not as a fresh U-POS Quality verdict.

## Stop rule

After this audit package and migration plan are committed, no Phase 1+ migration, code fix, schema change, U-POS modification or runtime orchestration implementation is authorized by this pass.
