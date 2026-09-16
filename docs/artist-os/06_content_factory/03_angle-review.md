# Angle Review & Decision

- **Status:** REVIEW COMPLETE
- **MASTER references:** §130–145, §392–393
- **Domain:** 06_content_factory
- **Feature slug:** `angle-review`
- **Requirement prefix:** `CNT-REV`

## 2. Purpose
Turn AI/manual concepts into deliberate human decisions and capture high-quality feedback for future behavior.

## 3. User problem / job-to-be-done
Without structured review, reject/approve clicks lose the reason and the system cannot learn whether an idea was generic, infeasible or simply not desired.

## 4. Scope
Angle detail/comparison, edit, approve, reject, defer, rejection taxonomy, provenance and transition to execution.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Angle content → Why this → context/evidence → fit/effort/novelty → decision controls → execution transition.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Open Angle → inspect/edit → approve, defer or reject with reason → persist decision → approved Angle can generate Execution Package.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-REV-001` Approval MUST be explicit human action.
- `CNT-REV-002` Rejection MUST support reason taxonomy plus optional free text.
- `CNT-REV-003` Recommended rejection reasons SHOULD include Too generic, Not me, Already done, Too expensive, Not feasible, Wrong song, Wrong tone, Wrong visual, Do not like idea, Other.
- `CNT-REV-004` Rejection reason MUST NOT automatically become permanent Artist Brain knowledge.
- `CNT-REV-005` User edits MUST be preserved as authored changes and available for AI telemetry/evals.
- `CNT-REV-006` Angle review MUST show why/context without exposing hidden chain-of-thought; concise rationale/evidence is sufficient.
- `CNT-REV-007` Approve MUST not automatically publish/schedule.
- `CNT-REV-008` Defer MUST preserve Angle without treating it as rejected.
- `CNT-REV-009` User SHOULD be able to compare a small candidate set side-by-side on desktop.
- `CNT-REV-010` If Guard flags identity conflict, user can revise, reject or create explicit IdentityDeviation where policy allows.
- `CNT-REV-011` Approved Angle MUST retain original provenance plus edited approved version.

## 15. AI behavior
AI may suggest improvements or explain conflicts. It must not pressure user to accept high-performing patterns against preference/Identity.

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
- `CNT-REV-AC01` Approve/reject/defer are distinct.
- `CNT-REV-AC02` Reject reason persists.
- `CNT-REV-AC03` User-edited approved version retains original provenance.
- `CNT-REV-AC04` Guard warning is explainable and overridable only through explicit supported path.
- `CNT-REV-AC05` Approve transitions to execution, not publication.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Whether reject taxonomy is global enum or configurable product taxonomy can be decided in data-model pass.

## 33. Traceability
§130–145, §392–393; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
