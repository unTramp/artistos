# Content Units

- **Status:** REVIEW COMPLETE
- **MASTER references:** §131–133, §187, §197–199
- **Domain:** 06_content_factory
- **Feature slug:** `content-units`
- **Requirement prefix:** `CNT-UNIT`

## 2. Purpose
Define the canonical unit of production that carries creative intent through Pipeline, Production, Assets and Publications.

## 3. User problem / job-to-be-done
An idea, a filmed take and a published post are different things. Without a ContentUnit boundary, lineage and platform adaptation collapse.

## 4. Scope
Creation from approved/manual Angle, metadata, state machine, lineage, priority, status and cross-domain references.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
ContentUnit detail → concept/angle → execution → production/assets → platform adaptations/publications → metrics/learning lineage.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Create from approved Angle/manual → populate metadata → move through MASTER state machine → attach production/assets → mark ready → create Publications → measure/analyze/archive.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-UNIT-001` ContentUnit MUST be distinct from ContentAngle and Publication.
- `CNT-UNIT-002` One ContentUnit MAY create multiple platform-specific Publications.
- `CNT-UNIT-003` ContentUnit MUST retain identityVersionId and optional era/deviation references used for execution.
- `CNT-UNIT-004` State transitions MUST follow MASTER state machine and preserve history.
- `CNT-UNIT-005` BLOCKED/REJECTED/PAUSED MUST be explicit additional states, not overloaded statuses.
- `CNT-UNIT-006` System SHOULD validate prerequisites for major transitions but allow reasoned manual override where safe.
- `CNT-UNIT-007` ContentUnit ID format `[SONG]-[TYPE]-[NUMBER]` applies where Song is relevant; non-song content needs a stable alternative strategy.
- `CNT-UNIT-008` Archiving MUST not delete Publications/Metrics lineage.
- `CNT-UNIT-009` Changing Song/Angle after production begins SHOULD require explicit reassociation and audit trail.
- `CNT-UNIT-010` ContentUnit MUST expose downstream lineage to selected takes/edits/publications/metrics.
- `CNT-UNIT-011` AI MUST NOT move a ContentUnit to published state by inference alone.

## 15. AI behavior
AI can suggest metadata/status next action but domain transition remains deterministic/application-controlled.

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
- `CNT-UNIT-AC01` Angle can create ContentUnit.
- `CNT-UNIT-AC02` ContentUnit can exist manually without AI.
- `CNT-UNIT-AC03` State history persists.
- `CNT-UNIT-AC04` Multiple Publications can reference one unit.
- `CNT-UNIT-AC05` Archive preserves lineage.
- `CNT-UNIT-AC06` Non-song units do not require fake Song.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Canonical ID format for non-song ContentUnits remains to be defined.

## 33. Traceability
§131–133, §187, §197–199; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
