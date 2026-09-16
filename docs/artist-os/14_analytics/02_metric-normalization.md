# Metric Normalization

- **Status:** REVIEW COMPLETE
- **MASTER references:** §287–291, §371–377
- **Domain:** 14_analytics
- **Feature slug:** `metric-normalization`
- **Requirement prefix:** `ANA-NRM`

## 2. Purpose
Translate platform-specific metric fields into a canonical schema while preserving raw semantics and missingness.

## 3. User problem / job-to-be-done
Each platform exports different names and availability. Without explicit normalization the OS compares unlike values or treats missing metrics as zero.

## 4. Scope
### In scope
- canonical fields
- provider/raw field mapping
- availability metadata
- derived metric formulas
- mapping versions

### Out of scope / non-goals
- inventing unavailable metrics
- forcing all platforms into identical feature set

## 5. Entry points
- CSV Wizard
- platform adapters
- Analytics imports

## 6. Preconditions and dependencies
- raw provider fields
- mapping templates
- Publication/platform context

## 7. Information architecture
Ingest raw record → identify source/platform/schema → map fields to canonical concepts → validate units/denominators → preserve raw values → calculate allowed derived metrics → store snapshot.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER MetricSnapshot fields and derived metric concepts. Mapping templates are reusable by source/version.

## 10. Main happy-path workflow
1. Preview mapping
2. confirm raw→canonical field
3. set unavailable fields as unmapped
4. validate sample records
5. save mapping template
6. import normalized snapshots

## 11. Alternative workflows
- platform lacks saves
- watch time in seconds vs milliseconds
- views definition changes
- CSV localized decimal formats

## 12. User actions
- map/unmap field
- save template
- override mapping version
- inspect raw

## 13. State model
Mapping templates/versioned import schema state; normalized snapshots immutable-ish evidence.

## 14. Business rules
- `ANA-NRM-001` Unavailable metric MUST be NULL/unmapped, never implicitly zero.
- `ANA-NRM-002` Raw provider field/value SHOULD be retained or traceable for audit.
- `ANA-NRM-003` Canonical mapping MUST be source/platform/schema-version aware.
- `ANA-NRM-004` Units MUST be normalized explicitly before comparison.
- `ANA-NRM-005` Derived metric formulas MUST expose denominator and handle zero/NULL safely.
- `ANA-NRM-006` Engagement Rate formula MUST not be universalized if source denominator semantics differ; implementation must record formula context.
- `ANA-NRM-007` Mapping changes MUST not silently reinterpret historical snapshots without versioned reprocessing.
- `ANA-NRM-008` Import preview MUST expose unmapped/ambiguous fields.
- `ANA-NRM-009` AI field suggestions MAY assist mapping but require confidence/review for ambiguous schemas.
- `ANA-NRM-010` No canonical metric may be fabricated from unrelated proxy fields.

## 15. AI behavior
AI may suggest field mappings based on headers/examples, but deterministic validation and user confirmation govern ambiguous mappings.

## 16. Human approval
Saving a reusable mapping template and reprocessing history require human review when semantics change.

## 17. Validation
- units known
- platform/source known
- derived denominator valid
- mapping conflicts surfaced

## 18. UI states
- auto-detected
- needs mapping
- validated
- ambiguous
- schema changed
- import failed

## 19. Edge cases
- localized headers
- percentage already precomputed
- duplicate columns
- provider changes units

## 20. Cross-module effects
- CSV Wizard
- Metric Snapshots
- Platform Adapters
- Data Quality

## 21. Notifications and attention model
- saved template no longer matches source schema

## 22. Search / filtering / sorting / bulk actions
Search mapping templates by source/platform/version. Bulk reprocess only with preview.

## 23. Analytics and product telemetry
- mapping suggested
- confirmed
- schema mismatch
- template saved

## 24. Learning feedback
No creative learning; improves data quality foundation.

## 25. Auditability / provenance
Preserve mapping version, raw field names, unit transforms and actor.

## 26. Desktop / mobile behavior
Desktop import/mapping; mobile read-only status.

## 27. Accessibility / usability
Mapping preview must show actual sample values/units.

## 28. Security / privacy / rights
Raw exports may be sensitive; secure storage and retention rules apply.

## 29. Performance / async jobs
Imports are background jobs with idempotency and validation reports.

## 30. Acceptance criteria
- `ANA-NRM-AC01` Missing saves remains NULL.
- `ANA-NRM-AC02` Unit mismatch is detected.
- `ANA-NRM-AC03` Historical mapping version is preserved.
- `ANA-NRM-AC04` Ambiguous AI mapping is not silently applied.

## 31. Test matrix
- missing field
- unit change
- localized CSV
- schema version change

## 32. Open questions
- Finalize canonical formula registry for derived metrics during engineering spec.

## 33. Traceability
MASTER §287–291, §371–377
