# Content Factory Home

- **Status:** REVIEW COMPLETE
- **MASTER references:** §127–146, §138–145, §346
- **Domain:** 06_content_factory
- **Feature slug:** `factory-home`
- **Requirement prefix:** `CNT-HOME`

## 2. Purpose
Provide the workspace where the artist moves from creative intent and evidence into a small set of reviewable content concepts, not an infinite generation feed.

## 3. User problem / job-to-be-done
Artists do not need “more ideas”; they need the right next ideas tied to song, identity, goal, available production resources and learning value.

## 4. Scope
Factory landing, context selection, generation entry, saved/approved/rejected angles, active experiments and “continue work” surfaces. It does not replace Pipeline or Calendar.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Current context → Generate/Explore → Angle candidates → Review queue → Approved to execute → recent rejects/learning signals.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
User chooses or accepts context → Factory shows what context will be used → generate bounded candidate set → review/edit/reject/approve → approved Angle proceeds to execution package/Pipeline.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-HOME-001` MUST show active context (Song/Campaign/Goal/Identity/Era/platforms) before generation.
- `CNT-HOME-002` MUST allow manual idea creation without AI.
- `CNT-HOME-003` MUST not default to an endless feed of regenerated variants.
- `CNT-HOME-004` MUST cap candidate count/retries according to Agent budgets/configuration.
- `CNT-HOME-005` MUST expose when evidence/context is insufficient.
- `CNT-HOME-006` MUST separate saved Angle candidates from ContentUnits already in production.
- `CNT-HOME-007` MUST preserve rejected ideas/reasons sufficiently to reduce near-duplicate regeneration.
- `CNT-HOME-008` MUST surface active Experiments relevant to generation so uncontrolled variation is avoided.
- `CNT-HOME-009` MUST keep recent approved/rejected work accessible for continuity.
- `CNT-HOME-010` MUST remain functional when AI provider is unavailable.
- `CNT-HOME-011` MUST not use popularity alone to override Identity or artist preference.
- `CNT-HOME-012` SHOULD prefer “continue/finish approved work” over generating more when Pipeline is already bottlenecked.

## 15. AI behavior
Assemble bounded context via Context Assembler, generate a small structured set, explain why each is proposed, and abstain when evidence is weak. Never self-approve.

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
- `CNT-HOME-AC01` User can create an Angle manually.
- `CNT-HOME-AC02` Generation clearly shows context used.
- `CNT-HOME-AC03` Factory works with AI disabled.
- `CNT-HOME-AC04` Repeated rejection reduces obvious duplicate suggestions without becoming a hard blacklist.
- `CNT-HOME-AC05` Approved work can move into execution without losing provenance.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Whether Factory Home should include a deterministic “capacity warning” projection from Pipeline before generation; behavior is recommended but exact threshold model is not frozen.

## 33. Traceability
§127–146, §138–145, §346; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
