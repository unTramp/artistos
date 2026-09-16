# Pattern Fatigue

- **Status:** REVIEW COMPLETE
- **MASTER references:** §146–147, §295
- **Domain:** 06_content_factory
- **Feature slug:** `fatigue`
- **Requirement prefix:** `CNT-FAT`

## 2. Purpose
Detect when repeated execution patterns may be losing effectiveness while avoiding overreaction to noisy short-term metrics.

## 3. User problem / job-to-be-done
Artists need a signal that a setup/hook/segment may be overused, but simplistic “this format is dead” conclusions create harmful optimization loops.

## 4. Scope
Pattern grouping, FRESH/HEALTHY/WATCH/SATURATED classification, evidence, trend, frequency, similarity, sample size and recommendations.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Pattern → usage history → evidence summary → fatigue state → explain confidence → suggest exploit/adjacent/explore response.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Aggregate repeated pattern evidence → guard for sample size/outliers → classify → show evidence/uncertainty → optionally create hypothesis/experiment.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-FAT-001` Fatigue states MUST be FRESH/HEALTHY/WATCH/SATURATED per MASTER.
- `CNT-FAT-002` Classification MUST consider relative performance trend, frequency, similarity, audience response, sample size and time window.
- `CNT-FAT-003` One underperforming post MUST NOT create SATURATED state by itself.
- `CNT-FAT-004` One viral outlier MUST NOT make a repeated pattern permanently HEALTHY.
- `CNT-FAT-005` Fatigue is a hypothesis-support signal, not causal fact.
- `CNT-FAT-006` Identity anchors MUST be separated from execution-pattern fatigue.
- `CNT-FAT-007` System SHOULD recommend adjacent test/exploration before declaring pattern abandoned when evidence is uncertain.
- `CNT-FAT-008` User must be able to inspect observations contributing to state.
- `CNT-FAT-009` Old evidence may decay in relevance without deletion.
- `CNT-FAT-010` Fatigue state SHOULD be scoped by platform/format/audience when evidence supports it.

## 15. AI behavior
Analytics Agent derives evidence; Strategy Agent may recommend next test. Both must state uncertainty and sample context.

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
- `CNT-FAT-AC01` Single failure cannot saturate pattern.
- `CNT-FAT-AC02` Evidence and sample size visible.
- `CNT-FAT-AC03` Outlier guard applies.
- `CNT-FAT-AC04` State can become stale/change with new evidence.
- `CNT-FAT-AC05` Adjacent test can be created from WATCH/SATURATED signal.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Exact fatigue classifier thresholds are intentionally not frozen in product spec; require eval/analytics calibration.

## 33. Traceability
§146–147, §295; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
