# Artist OS — Engineering Specification Workspace

**Status:** Pass 1 complete; v1.4 architecture consistency pass complete.
**Normative inputs:** MASTER v1.4 + AR-001…AR-062 companion contracts + approved Product Specs.

Engineering documents specify **how** to implement approved product/architecture contracts. They may not silently change domain ownership, human-approval rules, evidence semantics or scope boundaries.

## Engineering documents

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
ENGINEERING_V1.4_CONSISTENCY_PASS.md
```

## Architecture baseline rule

ACP-001…ACP-006 are approved and incorporated into MASTER v1.4. Their dependent entities/contracts are normative engineering inputs:

```text
PlanningObjective
Release / ReleaseTrack / CampaignTarget
ContentNarrativeLink primary + secondary semantics
OperationalAction
Take / TakeAsset
AssetDerivation
```

`PROVISIONAL[ACP-*]` markers are reserved only for future architecture proposals that have not yet been approved. They must not be used for ACP-001…ACP-006 after the v1.4 freeze.

## Pass 1 milestone

Engineering Spec Pass 1 covers documents 01–15 and has been reconciled against frozen MASTER v1.4. The next engineering deliverable is the Stage 0 Codex implementation handoff, followed by vertical MVP slices.
