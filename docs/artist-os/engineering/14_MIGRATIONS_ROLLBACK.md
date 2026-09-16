# Artist OS — Engineering Spec 14: Migrations & Rollback

**Status:** DRAFT / Pass 1

## 1. Principles

### ENG-MIG-001 — No destructive migration without plan
Before risky migration: backup, forward plan, validation, rollback/restore plan.

### ENG-MIG-002 — Expand/contract
Prefer additive schema first, backfill, dual-read/write if needed, validate, then remove deprecated field in later migration.

### ENG-MIG-003 — Provenance preservation
Never fabricate historical facts to satisfy new schema. Unknown legacy state remains unknown with migration note/provenance.

## 2. Migration metadata
Track migration ID, appliedAt, application version, checksum and environment.

## 3. Architecture-approved migrations

PlanningObjective, Release/ReleaseTrack/CampaignTarget, primary/secondary narrative links, OperationalAction, Take/TakeAsset and AssetDerivation are approved in MASTER v1.4. Their schema migrations are normal reviewed product migrations and must not be labeled provisional solely because they originated in ACP-001…ACP-006.

Future migrations that depend on an unapproved ACP remain provisional/dev-only until that architecture proposal is explicitly approved.

## 4. Data backfill jobs
Large backfills run as resumable/idempotent jobs rather than one giant transaction when volume warrants.

## 5. Compatibility window
Application code should tolerate old/new representation during staged production migrations where zero-downtime is required.

## 6. Rollback classes

```text
CODE_ROLLBACK_SAFE
SCHEMA_BACKWARD_COMPATIBLE
RESTORE_REQUIRED
EXTERNAL_EFFECT_NON_REVERSIBLE
```

A deployment checklist declares applicable class.

## 7. External effects
Publishing, provider submissions and other external actions cannot be “rolled back” by DB rollback. Use reconciliation/compensating actions and preserve audit.

## 8. Backup verification
Before high-risk production migration, verify recent backup exists and restoration procedure has been tested in representative environment.

## 9. Migration validation
Post-migration checks include row counts/invariants, orphan detection, nullability expectations, domain status validity and representative query smoke tests.

## 10. Acceptance criteria

- no migration destroys canonical data without reviewed plan;
- ambiguous legacy history remains explicit;
- external provider state never assumed rolled back with DB;
- schema changes are traceable to architecture/engineering contract.
