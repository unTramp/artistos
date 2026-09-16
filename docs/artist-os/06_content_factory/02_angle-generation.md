# Content Angle Generation

- **Status:** REVIEW COMPLETE
- **MASTER references:** §130, §138–141, §341–346
- **Domain:** 06_content_factory
- **Feature slug:** `angle-generation`
- **Requirement prefix:** `CNT-ANG`

## 2. Purpose
Generate artist-specific Content Angles before scripts/captions, maximizing relevance and learning value rather than raw volume.

## 3. User problem / job-to-be-done
Generic AI jumps directly to captions and formats without first deciding what idea is worth making. Artist OS needs a structured concept layer.

## 4. Scope
Context request, bounded generation, structured Angle Card, rationale, required assets, effort and learning opportunity.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Inputs panel → context preview → candidate Angle cards → rationale/evidence → review.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Choose inputs → Context Assembler builds pack → Strategy Agent returns bounded structured angles → Guard checks obvious violations/genericity → user reviews.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-ANG-001` First AI step MUST generate Content Angles, not captions.
- `CNT-ANG-002` Every generated Angle MUST contain idea, why, pillar, audience, goal, identity fit rationale, required assets, production effort and learning opportunity.
- `CNT-ANG-003` Angle SHOULD include Narrative Track and Song/Segment when context supports them.
- `CNT-ANG-004` Angle MUST preserve explicit user request above generic learned preferences unless unsafe/hard constraint conflict exists.
- `CNT-ANG-005` Generation MUST use active Identity Version/Era references when available.
- `CNT-ANG-006` Cold-start generation MUST clearly rely more on Identity/Song/current authoritative platform knowledge than own analytics.
- `CNT-ANG-007` Mature-state generation SHOULD weight own validated evidence above generic creator advice.
- `CNT-ANG-008` AI MUST NOT invent audience facts, market performance or available equipment.
- `CNT-ANG-009` Required assets MUST be expressed as requirements, not assumed to exist.
- `CNT-ANG-010` Production effort MUST be qualitative/explainable unless actual cost/time model exists.
- `CNT-ANG-011` Learning opportunity MUST identify what could be learned, not claim future causality.
- `CNT-ANG-012` Generated set SHOULD include controlled diversity without violating active constraints.
- `CNT-ANG-013` Generation MUST respect max variant/retry/similarity protections.
- `CNT-ANG-014` If no meaningful variation exists, system SHOULD return fewer candidates rather than filler.

## 15. AI behavior
Use Strategy Agent with Context Pack. Structured output validation is mandatory. Guard may flag issues but cannot silently rewrite creative intent without traceability.

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
- `CNT-ANG-AC01` Generated output is Angle cards, not final captions.
- `CNT-ANG-AC02` Each Angle has rationale and learning value.
- `CNT-ANG-AC03` Missing equipment/assets are not invented.
- `CNT-ANG-AC04` Cold-start state is explicit.
- `CNT-ANG-AC05` System can return “insufficient evidence” or fewer ideas.
- `CNT-ANG-AC06` Context provenance can be inspected.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Exact default candidate count is configuration/product tuning, not architectural constant.

## 33. Traceability
§130, §138–141, §341–346; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
