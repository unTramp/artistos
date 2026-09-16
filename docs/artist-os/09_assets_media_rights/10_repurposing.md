# Repurposing Plans

- **Status:** REVIEW COMPLETE
- **MASTER references:** §189–191, §197–202, §216
- **Domain:** 09_assets_media_rights
- **Feature slug:** `repurposing`
- **Requirement prefix:** `AST-REP`

## 2. Purpose
Coordinate deliberate reuse of a source Asset/content concept across multiple derivatives and platforms while preserving platform adaptation, identity, rights and lineage.

## 3. User problem / job-to-be-done
Repurposing can save effort, but naive “post the same thing everywhere” ignores platform format, audience intent and creative fatigue. The system needs one source strategy with intentional derivatives/adaptations.

## 4. Scope
MASTER `RepurposingPlan {sourceAssetId, derivatives[], targetPlatforms[], priority, status}`, derivative intents, target platform linkage, progress and lineage.

## 5. Entry points
Asset Atomization, Asset detail, ContentUnit, Campaign, Evergreen Pool.

## 6. Preconditions and dependencies
Source Asset/content rights and identity compatibility. Platform capabilities when adaptation relies on current constraints.

## 7. Information architecture
Source → plan objective → derivative rows → platform targets → status/lineage → outcome summary.

## 8. User roles and permissions
Single artist creates/approves. AI may suggest plan.

## 9. Core data model
RepurposingPlan + derivative plan items linking future ContentAngles/Units/DerivedAssets/Publications. Exact derivatives[] schema open in MASTER.

## 10. Main happy-path workflow
Select source → choose objective/platforms → propose/define derivatives → validate rights/identity/platform → approve selected rows → create downstream work → track produced/published outputs → review reuse/fatigue.

## 11. Alternative workflows
Same master concept adapted without new asset; one derivative for several platforms; campaign-specific repackage; old archive reactivated; rights limit one platform/use.

## 12. User actions
Create/edit plan, add/remove derivative, assign target platform, prioritize, approve/send to Factory/Pipeline, archive, inspect outcomes.

## 13. State model
Plan Draft/Active/Completed/Archived; item Planned/In Progress/Produced/Published/Cancelled projection. Formal enums open.

## 14. Business rules
- `AST-REP-001` RepurposingPlan MUST identify a source Asset and preserve lineage to all outputs.
- `AST-REP-002` Repurposing MUST distinguish derivative media creation from platform-specific Publication adaptation.
- `AST-REP-003` Same master concept MAY have different hook/caption/crop/duration/CTA per platform.
- `AST-REP-004` Platform adaptation MUST use fresh capability knowledge where hard requirements matter.
- `AST-REP-005` Rights constraints MUST be checked per intended derivative/use/platform when relevant.
- `AST-REP-006` Identity/Mystique constraints MUST apply to each output.
- `AST-REP-007` Plan SHOULD expose previous similar reuse and fatigue context.
- `AST-REP-008` System MUST NOT require every target platform to receive every source asset.
- `AST-REP-009` AI SHOULD prefer a small coherent derivative set over maximal output volume.
- `AST-REP-010` User MAY intentionally keep source single-use.
- `AST-REP-011` A platform adaptation that changes core creative variable may need a distinct ContentUnit/experiment variant; this boundary must remain visible.
- `AST-REP-012` Published outputs retain independent Publication metrics.
- `AST-REP-013` Repurposing outcome MUST NOT pool cross-platform raw views into one quality ranking.
- `AST-REP-014` Plan status MUST not imply all derivative outputs succeeded/published.
- `AST-REP-015` AI/provider outage MUST not block manual repurposing planning.

## 15. AI behavior
Suggests bounded derivatives based on source, goal, campaign, platform capabilities and fatigue. Must show why each derivative exists and required transformations.

## 16. Human approval
Plan/derivative commitment and publish actions human-controlled.

## 17. Validation
Source exists/rights; targets valid/current where needed; no duplicate identical derivative rows without intent.

## 18. UI states
Draft, active, partially produced, rights blocked, platform stale, completed, archived, AI unavailable.

## 19. Edge cases
Source license excludes some platform; ContentUnit vs adaptation boundary unclear; old asset from archived Era; one derivative becomes separate experiment.

## 20. Cross-module effects
Factory, Pipeline, Derived Assets, Distribution, Analytics, Content History.

## 21. Notifications and attention model
Only committed derivative blockers/deadlines; unexecuted optional ideas not alerts.

## 22. Search / filtering / sorting / bulk actions
Filter source/Campaign/platform/status; bulk cancel/archive safe items.

## 23. Analytics and product telemetry
Plan-to-output conversion, derivative count, platform adaptation edits, rights blocks, source reuse frequency.

## 24. Learning feedback
Each Publication analyzed independently; repeated adaptation evidence may support platform-specific learning.

## 25. Auditability / provenance
Source, derivative rationale, AI config, transformations, resulting IDs.

## 26. Desktop / mobile behavior
Desktop plan matrix; mobile status/quick approval.

## 27. Accessibility / usability
Do not make platform rows color-only; explain source/output distinction.

## 28. Security / privacy / rights
Rights/privacy inherited per output; internal source cannot become public automatically.

## 29. Performance / async jobs
Suggestion generation/asset processing async; plan CRUD immediate.

## 30. Acceptance criteria
- `AST-REP-AC01` Source and all outputs remain traceable.
- `AST-REP-AC02` Platform adaptation can differ without losing master concept lineage.
- `AST-REP-AC03` Rights are validated per intended use.
- `AST-REP-AC04` Raw cross-platform metrics are not collapsed into one score.
- `AST-REP-AC05` Manual workflow survives AI outage.

## 31. Test matrix
Two platform adaptations; rights-restricted platform; same asset reuse; experiment variant; archived Era source; AI outage.

## 32. Open questions
Exact schema for `derivatives[]` and canonical product rule for when adaptation becomes new ContentUnit remain tied to Content Factory unresolved item #26.

## 33. Traceability
MASTER §189–202, §216.
