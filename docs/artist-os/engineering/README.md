# Artist OS — Engineering Specification Workspace

**Status:** Pass 1 started.
**Normative inputs:** MASTER v1.3 + approved Product Specs.
**Provisional inputs:** Architecture Freeze Candidate / ACPs marked PROPOSED.

Engineering documents may specify **how** to implement an approved product/architecture contract. They may not silently change domain ownership, human-approval rules, evidence semantics or scope boundaries.

## Planned engineering documents

```text
00_ENGINEERING_SPEC_INDEX.md
01_SYSTEM_ARCHITECTURE.md
02_DATA_MODEL_CONVENTIONS.md
03_LOGICAL_DATA_MODEL.md
04_DOMAIN_COMMANDS_EVENTS.md
05_APPLICATION_SERVICES.md
06_API_CONTRACTS.md
07_JOBS_WORKERS.md
08_AI_RUNTIME.md
09_STORAGE_MEDIA.md
10_INTEGRATIONS.md
11_SECURITY_PRIVACY.md
12_OBSERVABILITY.md
13_TESTING_TRACEABILITY.md
14_MIGRATIONS_ROLLBACK.md
15_DEPLOYMENT_OPERATIONS.md
```

## Provisional rule

Any schema/API contract depending on ACP-001…ACP-006 must include:

```text
ARCHITECTURE STATUS: PROVISIONAL
ACP: <id>
```

until the ACP is approved and merged into the next frozen MASTER.

## Pass 1 milestone

Engineering Spec Pass 1 now covers documents 01–15. ACP-001…ACP-006 dependent contracts remain explicitly PROVISIONAL until architecture freeze approval. Next pass is consistency/traceability review against all 2,334 product requirements and Stage 0 Codex handoff generation.
