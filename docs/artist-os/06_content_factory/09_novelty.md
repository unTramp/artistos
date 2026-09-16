# Novelty Tracking

- **Status:** REVIEW COMPLETE
- **MASTER references:** §144–145, §189–190
- **Domain:** 06_content_factory
- **Feature slug:** `novelty`
- **Requirement prefix:** `CNT-NOV`

## 2. Purpose
Help the artist avoid accidental repetition while preserving deliberate signature identity and recurring formats.

## 3. User problem / job-to-be-done
Repetition can occur at concept, setup, hook, song segment and format levels. A naive similarity score wrongly punishes recognizable style.

## 4. Scope
Novelty comparison across concept, visual setup, hook style, audio segment, format and narrative with similar-unit references.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Candidate/execution → retrieve comparable history → classify HIGH/MEDIUM/LOW novelty → show dimensions/similar units → user decides.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
On generation/review request novelty → system compares relevant history → explain similarities/differences → user may keep, vary or mark intentional repetition.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-NOV-001` Novelty MUST be multidimensional and explainable.
- `CNT-NOV-002` Output MUST use HIGH/MEDIUM/LOW plus similar units per MASTER, not arbitrary precision score.
- `CNT-NOV-003` Stable Identity anchors MUST not be penalized like execution repetition.
- `CNT-NOV-004` RecurringSeries intentional format repetition MUST be recognized as such.
- `CNT-NOV-005` SongSegment repetition SHOULD be surfaced separately from visual/concept repetition.
- `CNT-NOV-006` Low novelty is a warning/context, not automatic rejection.
- `CNT-NOV-007` Novelty comparison MUST use relevant scope/time where possible rather than entire archive equally.
- `CNT-NOV-008` AI MUST not claim audience fatigue solely from semantic similarity.
- `CNT-NOV-009` User may mark similarity intentional and add reason.
- `CNT-NOV-010` Novelty should feed exploration prompts but not force randomness.

## 15. AI behavior
Use retrieval/similarity to identify comparable units, then explain dimension-level overlap. Never convert similarity into guaranteed fatigue prediction.

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
- `CNT-NOV-AC01` Similar units are inspectable.
- `CNT-NOV-AC02` Identity anchor reuse is not automatically low novelty.
- `CNT-NOV-AC03` Intentional recurring series is handled.
- `CNT-NOV-AC04` Low novelty never auto-rejects.
- `CNT-NOV-AC05` Output is explainable HIGH/MEDIUM/LOW.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Exact similarity algorithms/thresholds deferred to implementation/eval tuning.

## 33. Traceability
§144–145, §189–190; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
