# Factory Identity Check

- **Status:** REVIEW COMPLETE
- **MASTER references:** §87–91, §122, §145
- **Domain:** 06_content_factory
- **Feature slug:** `identity-check`
- **Requirement prefix:** `CNT-IDC`

## 2. Purpose
Apply Brand/Identity Guard at the point where a creative idea becomes execution while preserving intentional creative exceptions.

## 3. User problem / job-to-be-done
Identity consistency helps coherence, but a rigid brand checker can suppress evolution. The system needs explainable alignment and explicit deviation paths.

## 4. Scope
Pre-generation constraints, post-angle check, execution-package check, deviation request and Guard rationale.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Identity Capsule → candidate/execution → Guard result → explanation → revise / approve aligned / record deviation where allowed.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Run deterministic/rule + AI-supported check → show ALIGNED/PARTIALLY_ALIGNED/OUTSIDE_IDENTITY → user decides → approved deviations are linked.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-IDC-001` Guard MUST use the Identity Version/Era relevant to the content, not always current latest.
- `CNT-IDC-002` Guard MUST return categorical alignment with explanations, not fake numeric score.
- `CNT-IDC-003` Non-negotiable constraints MUST be distinguished from preferred/experimental rules.
- `CNT-IDC-004` Intentional deviation MUST use IdentityDeviation with reason and approval.
- `CNT-IDC-005` Performance data MUST NOT automatically change Identity rules in this flow.
- `CNT-IDC-006` Guard MUST respect Mystique/Interpretation protected information.
- `CNT-IDC-007` Identity anchors repeated intentionally MUST not be penalized as generic execution repetition.
- `CNT-IDC-008` Guard warning MUST NOT silently rewrite artist-authored content.
- `CNT-IDC-009` If Identity is incomplete, system MUST state limited-check coverage.
- `CNT-IDC-010` Rights/safety issues remain separate from aesthetic alignment even if surfaced together.

## 15. AI behavior
Brand/Identity Guard checks structured constraints plus tone/style; it explains conflict and suggested revisions but does not auto-rebrand.

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
- `CNT-IDC-AC01` Correct historical Identity version is used.
- `CNT-IDC-AC02` No fake identity score.
- `CNT-IDC-AC03` Deviation can be approved with reason.
- `CNT-IDC-AC04` Mystique leak is caught where rule exists.
- `CNT-IDC-AC05` Incomplete identity yields limited-confidence check.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Precedence among Identity/Era/Song/Content deviations remains a Context/Guard cross-domain schema question already tracked.

## 33. Traceability
§87–91, §122, §145; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
