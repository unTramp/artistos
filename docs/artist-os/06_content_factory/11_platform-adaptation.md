# Platform Adaptation

- **Status:** REVIEW COMPLETE
- **MASTER references:** §197–202, §217–222, §287–291
- **Domain:** 06_content_factory
- **Feature slug:** `platform-adaptation`
- **Requirement prefix:** `CNT-PLT`

## 2. Purpose
Adapt one master creative concept into platform-specific executions/publications without fragmenting the creative idea or hardcoding stale platform rules.

## 3. User problem / job-to-be-done
Cross-posting the exact same package ignores platform constraints, while rebuilding separate concepts destroys lineage and learning comparability.

## 4. Scope
Per-platform hook, caption, crop, duration, thumbnail/title, CTA, audio and metadata adaptations tied to one ContentUnit.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Master ContentUnit → target platforms → capability/asset requirements → adaptation drafts → review → Publications.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Select platforms → load current capability/requirements → generate/manual adaptations → validate → approve → downstream Publication/scheduling.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-PLT-001` One ContentUnit MAY have multiple platform adaptations/Publications.
- `CNT-PLT-002` Adaptation MUST preserve master concept lineage.
- `CNT-PLT-003` Platform-specific hook/caption/crop/duration/thumbnail/title/CTA/audio/metadata MAY differ.
- `CNT-PLT-004` Hard platform constraints MUST come from current Platform Capability/Asset Requirement knowledge with freshness.
- `CNT-PLT-005` Stale/unverified rule MUST be labeled, not presented as fact.
- `CNT-PLT-006` No platform adaptation may silently violate Identity/Mystique/rights constraints.
- `CNT-PLT-007` Missing capability data MUST not be invented.
- `CNT-PLT-008` Cross-platform analytics MUST not compare raw views as equivalent success by default.
- `CNT-PLT-009` AI may optimize packaging for platform but MUST not rewrite core concept unless user requests a variant/new ContentUnit.
- `CNT-PLT-010` If adaptation meaningfully changes concept/test variable, system SHOULD create a distinct ContentUnit/Experiment relationship rather than hide it as metadata.
- `CNT-PLT-011` PublishingMode selection remains Distribution responsibility.

## 15. AI behavior
Use current Platform knowledge + master execution package to propose differences. Clearly separate official hard constraints from practitioner heuristics.

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
- `CNT-PLT-AC01` Same concept can produce multiple platform drafts.
- `CNT-PLT-AC02` Stale rule is visible.
- `CNT-PLT-AC03` Missing platform data is not fabricated.
- `CNT-PLT-AC04` Large conceptual change is not hidden as simple adaptation.
- `CNT-PLT-AC05` Publication ownership remains Distribution.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Boundary for “adaptation change large enough to require new ContentUnit” needs heuristics/evals, not a single hard threshold.

## 33. Traceability
§197–202, §217–222, §287–291; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
