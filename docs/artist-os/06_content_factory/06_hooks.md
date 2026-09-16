# Hook Variants

- **Status:** REVIEW COMPLETE
- **MASTER references:** §134–137, §297, §304–306
- **Domain:** 06_content_factory
- **Feature slug:** `hooks`
- **Requirement prefix:** `CNT-HOOK`

## 2. Purpose
Model hooks as testable creative components across spoken/text/visual/audio dimensions rather than vague “make it hookier” advice.

## 3. User problem / job-to-be-done
Creators often change concept, edit and hook simultaneously, making learning impossible. Artist OS should support controlled hook variants.

## 4. Scope
HookVariant creation/edit, taxonomy, emotional mechanism, duration-to-hook, experiment linkage and analytics attribution.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Base concept → hook dimensions → variants → optional experiment → executions → analytics comparison.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Create/select base execution → define A/B/C HookVariants → hold other variables as stable as practical → publish via separate ContentUnits/Publications → analyze.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-HOOK-001` HookVariant MUST support spokenHook, textHook, visualHook, audioHook, hookPattern, emotionalMechanism, durationToHook and optional experimentId.
- `CNT-HOOK-002` Hook taxonomy MUST include MASTER patterns and remain extensible.
- `CNT-HOOK-003` Hook A/B/C intended as experiment MUST relate to same base concept.
- `CNT-HOOK-004` When multiple major variables change, experiment MUST be labeled multi-factor rather than clean hook test.
- `CNT-HOOK-005` No variant may be declared winner from a single observation without adequate evidence.
- `CNT-HOOK-006` Hook analytics MUST retain platform/audience scope.
- `CNT-HOOK-007` Emotional mechanism is descriptive creative metadata, not psychological manipulation guarantee.
- `CNT-HOOK-008` DurationToHook is optional when not meaningful.
- `CNT-HOOK-009` AI may propose variants but MUST explain what variable differs.
- `CNT-HOOK-010` Hook variants MUST inherit identity/rights constraints from base execution.

## 15. AI behavior
Suggest materially distinct hook variants while preserving concept for controlled tests. Avoid guaranteed-virality language.

## 16. Human approval
AI output remains proposal. User approval is required before an Angle becomes committed production work, before identity deviation, and before any publish/schedule action.

## 17. Validation
Required structured fields must be present before transition. References must resolve. Unknown/missing inputs remain unknown. Rights and platform constraints cannot be fabricated.

## 18. UI states
Empty, context-incomplete, generating, generated, edited, rejected, approved, blocked, AI unavailable, provider/capability stale, insufficient evidence.

## 19. Edge cases
Conflicting learnings; Identity/Era change during draft; same idea generated repeatedly; linked Song/Segment deleted/changed; rights uncertainty; multiple target platforms; experiment variant accidentally changes multiple variables.

## 20. Cross-module effects
Approved outputs feed Pipeline/Calendar/Production/Assets/Distribution. Rejections and edits feed product telemetry and may become candidate preference evidence, never permanent knowledge automatically.

## 21. Notifications and attention model
Factory should not notify merely because ideas exist. Attention is appropriate for approved work blocked by missing critical dependency or unresolved human approval.

## 22. Search / filtering / sorting / bulk actions
Filter by Song, Campaign, Pillar, Narrative, Platform, Mode, status, priority and experiment. Bulk approval should be conservative; bulk reject/tag allowed with explicit intent.

## 23. Analytics and product telemetry
Track angle acceptance/rejection reason, edit distance, retries, time-to-approve, similarity, execution conversion, Identity Guard overrides and AI cost/latency.

## 24. Learning feedback
Factory behavior creates evidence about accepted/rejected concepts and later performance, but validated learning only emerges through Insight/Hypothesis/Experiment/Learning pipeline.

## 25. Auditability / provenance
Store prompt/config/context provenance through AgentRun, selected sources/rules and user edits/rejection reasons where AI participated.

## 26. Desktop / mobile behavior
Desktop is primary for ideation/review. Mobile supports quick capture, approval/rejection and lightweight edits; dense comparison remains desktop-first.

## 27. Accessibility / usability
Explain AI rationale in plain language. Do not encode fit/risk solely by color. Preserve keyboard navigation for comparison/review.

## 28. Security / privacy / rights
Private story/Internal Canon content must respect Mystique/Interpretation policies. External/generated/licensed assets require rights-aware handling in downstream production.

## 29. Performance / async jobs
Generation is async via JobService/AgentRun where long-running. Existing drafts/context render immediately and do not block on AI.

## 30. Acceptance criteria
- `CNT-HOOK-AC01` A/B/C can share base concept.
- `CNT-HOOK-AC02` Changed variable is visible.
- `CNT-HOOK-AC03` Multi-factor test is labeled correctly.
- `CNT-HOOK-AC04` Analytics can attribute performance to hook metadata with platform scope.
- `CNT-HOOK-AC05` No single-post winner promotion.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Exact minimum observation threshold comes from Experiment design/config, not Hook entity.

## 33. Traceability
§134–137, §297, §304–306; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
