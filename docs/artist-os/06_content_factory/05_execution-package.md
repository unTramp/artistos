# Execution Package

- **Status:** REVIEW COMPLETE
- **MASTER references:** §141, §162–176
- **Domain:** 06_content_factory
- **Feature slug:** `execution-package`
- **Requirement prefix:** `CNT-EXEC`

## 2. Purpose
Translate an approved Angle into a feasible, production-ready creative package without losing the concept, identity constraints or learning intent.

## 3. User problem / job-to-be-done
Good concepts fail in execution when shot list, audio segment, constraints, available equipment and platform needs are not connected.

## 4. Scope
Hook, structure, script/performance concept, shot list, audio segment, production intent, edit brief, caption, CTA, platform notes and identity constraints.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Approved Angle → package sections → feasibility/constraints → approve/edit → create/update ContentUnit and Production work.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Open approved Angle → Production Agent uses capability context → returns structured package → user edits/approves → package becomes production source for ContentUnit/Shoot.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-EXEC-001` Execution Package MUST originate from an approved Angle or explicit manual equivalent.
- `CNT-EXEC-002` MUST include the MASTER execution fields applicable to the concept.
- `CNT-EXEC-003` MUST use ProductionCapabilityProfile and available locations/assets where known.
- `CNT-EXEC-004` MUST provide feasible fallback when ideal production requirement is unavailable.
- `CNT-EXEC-005` MUST distinguish production intent AUTHENTIC/CASUAL/POLISHED/CINEMATIC/EXPERIMENTAL.
- `CNT-EXEC-006` MUST include exact SongSegment/AudioUsage reference when a specific segment is chosen.
- `CNT-EXEC-007` MUST carry critical Identity constraints and any approved deviation.
- `CNT-EXEC-008` MUST flag unknown rights rather than assuming publishability.
- `CNT-EXEC-009` Caption/CTA are downstream components of the package, not the foundational idea.
- `CNT-EXEC-010` Platform notes MUST come from current capability/knowledge when rule-like.
- `CNT-EXEC-011` Shot list SHOULD be actionable enough to feed Shoot planning without overloading on-set view.
- `CNT-EXEC-012` Edits to package MUST not silently rewrite original approved Angle rationale.

## 15. AI behavior
Production Agent optimizes for feasibility and artist intent, not maximum polish. Strategy/Production responsibilities remain separate logical roles.

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
- `CNT-EXEC-AC01` Approved Angle can produce package.
- `CNT-EXEC-AC02` Unavailable gear results in feasible fallback.
- `CNT-EXEC-AC03` Selected audio segment is explicit.
- `CNT-EXEC-AC04` Identity/rights constraints travel with package.
- `CNT-EXEC-AC05` User can edit before Production/Pipeline.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Whether ExecutionPackage is first-class persisted entity or versioned structured fields attached to ContentUnit needs schema audit.

## 33. Traceability
§141, §162–176; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
