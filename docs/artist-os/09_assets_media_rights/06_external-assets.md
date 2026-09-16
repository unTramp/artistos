# External Assets and Acquisition Plans

- **Status:** REVIEW COMPLETE
- **MASTER references:** §181–186, §328, §378
- **Domain:** 09_assets_media_rights
- **Feature slug:** `external-assets`
- **Requirement prefix:** `AST-EXT`

## 2. Purpose
Represent external media/tool sources and planned acquisition choices without hardcoding vendors or confusing reference discovery with acquired rights.

## 3. User problem / job-to-be-done
A production brief may require stock footage, font, template, commissioned photo or licensed asset. The system needs to say what is needed, acceptable rights and fallback—not simply link to a provider and assume permission.

## 4. Scope
ExternalAssetSource registry, AssetAcquisitionPlan, preferredOrigin, budget, rights requirements, fallbacks and conversion into actual Asset/Rights record.

## 5. Entry points
Production Agent, Asset Library, Brand/Website needs, rights-blocked requirement.

## 6. Preconditions and dependencies
A requirement or candidate external Asset source.

## 7. Information architecture
Requirement → acquisition options/source → rights requirement → budget/effort → fallbacks → acquired/linked Asset.

## 8. User roles and permissions
Single artist chooses/acquires externally. OS tracks; it does not autonomously purchase/license unless future explicit integration scope.

## 9. Core data model
MASTER ExternalAssetSource registry + `AssetAcquisitionPlan {requirement, preferredOrigin, budget, rightsRequirement, fallbacks[]}` and resulting Asset/AssetRights when acquired.

## 10. Main happy-path workflow
Production identifies missing asset → plan defines requirement/origin/rights/budget/fallback → user acquires/imports asset → records source/license/proof → requirement marked satisfied → downstream use references canonical Asset.

## 11. Alternative workflows
Use existing original asset; commission creator; licensed stock; curated reference only; generated fallback; budget removed; provider unavailable.

## 12. User actions
Create/edit plan, choose fallback, link source, mark acquired, import proof, abandon requirement.

## 13. State model
Needed/Researching/Acquired/Satisfied/Abandoned product projection; formal enum not MASTER-defined.

## 14. Business rules
- `AST-EXT-001` External provider/service names MUST remain registry/configuration data, not architectural dependencies.
- `AST-EXT-002` AcquisitionPlan MUST state requirement and rights requirement before considering candidate “satisfied” where rights matter.
- `AST-EXT-003` Discovery/source URL MUST NOT imply acquisition/license.
- `AST-EXT-004` REFERENCE_ONLY material MUST remain reference unless valid acquisition evidence exists.
- `AST-EXT-005` Preferred origin SHOULD follow Original Content First principle where practical, but user may choose licensed/generated/commissioned assets intentionally.
- `AST-EXT-006` Fallbacks SHOULD be feasible alternatives, not automatic downgrades.
- `AST-EXT-007` Budget may be unknown; unknown MUST not become zero.
- `AST-EXT-008` AI MUST NOT fabricate provider pricing/license terms.
- `AST-EXT-009` Actual acquired item MUST become canonical Asset with explicit AssetOrigin and RightsStatus.
- `AST-EXT-010` Source/license freshness SHOULD be recorded where provider terms can change.
- `AST-EXT-011` OS MUST NOT autonomously purchase/license external assets in v1.3.
- `AST-EXT-012` AcquisitionPlan completion MUST NOT bypass normal rights validation.

## 15. AI behavior
Can suggest asset requirement/fallback/source categories from Production plan; external current pricing/terms require sourced research/integration when explicitly used.

## 16. Human approval
Acquisition/source choice and rights evidence human-controlled.

## 17. Validation
Requirement nonempty; budget currency if numeric; rights requirements explicit enough; acquired asset link valid.

## 18. UI states
Needed, candidates, unknown price, reference-only, acquired pending rights, satisfied, abandoned.

## 19. Edge cases
Provider disappears; license changes after download; commissioned creator delivers different format; free asset still requires attribution.

## 20. Cross-module effects
Production readiness, Asset Library/Rights, Production Economics.

## 21. Notifications and attention model
Critical unsatisfied acquisition requirement near Shoot/Publication may surface.

## 22. Search / filtering / sorting / bulk actions
Filter status/origin/rights/budget; no broad auto-acquisition.

## 23. Analytics and product telemetry
Plan satisfaction, fallback use, rights corrections, time-to-acquire.

## 24. Learning feedback
Operational sourcing preferences may become user preference candidates, not platform/artistic laws.

## 25. Auditability / provenance
Requirement source, options, chosen source, proof.

## 26. Desktop / mobile behavior
Desktop planning; mobile proof/photo capture and status update.

## 27. Accessibility / usability
Clear distinction “reference” vs “licensed/owned”.

## 28. Security / privacy / rights
External credentials/secrets never stored in frontend; proof protected.

## 29. Performance / async jobs
Current source research async only if invoked; CRUD immediate.

## 30. Acceptance criteria
- `AST-EXT-AC01` Source URL alone cannot satisfy rights.
- `AST-EXT-AC02` Acquired item becomes canonical Asset with rights.
- `AST-EXT-AC03` Unknown budget remains unknown.
- `AST-EXT-AC04` Provider is not hardcoded dependency.

## 31. Test matrix
Stock; commissioned; generated; reference-only; unknown budget; changed license; provider unavailable.

## 32. Open questions
Whether ExternalAssetSource is user-configurable registry UI in MVP or seed/config-backed only.

## 33. Traceability
MASTER §181–186, §328, §378.
