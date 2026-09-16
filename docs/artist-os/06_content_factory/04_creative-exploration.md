# Creative Exploration Session

- **Status:** REVIEW COMPLETE
- **MASTER references:** §142–143, §312–313
- **Domain:** 06_content_factory
- **Feature slug:** `creative-exploration`
- **Requirement prefix:** `CNT-EXP`

## 2. Purpose
Provide an intentional divergent space for wildcard/adjacent concepts without contaminating normal exploit-oriented Factory recommendations.

## 3. User problem / job-to-be-done
If every idea is optimized from historical winners, the artist converges and stagnates. Exploration must be safe, bounded and clearly labeled.

## 4. Scope
Exploration prompts, divergence, clustering, convergence, saved candidates and experiment linkage.

## 5. Entry points
Factory navigation, Song Brain, Campaign, Calendar/Pipeline, Command Palette where applicable.

## 6. Preconditions and dependencies
Artist is required. Identity/Song/Campaign/Platform/Production context is loaded when available; lack of optional context must be explicit rather than silently substituted with generic assumptions.

## 7. Information architecture
Exploration intent → optional prompt lens → divergent batch → cluster/compare → select promising ideas → convert to Angle/Experiment.

## 8. User roles and permissions
MVP single-artist user may create/edit/reject/approve drafts. Publishing, destructive actions and permanent knowledge promotion remain outside Factory approval.

## 9. Core data model
Uses MASTER ContentAngle, ContentUnit, HookVariant, AudioUsage, IdentityVersion/Era references, NarrativeTrack, Experiment and lineage entities. Final relational boundaries follow Stage-0 schema audit.

## 10. Main happy-path workflow
Start session → select exploration level/lens → generate/manual brainstorm → cluster → user selects → selected item becomes structured Angle with provenance.

## 11. Alternative workflows
No Song; no Campaign; incomplete Identity; no suitable assets; AI unavailable; user starts from an existing idea; experiment-controlled variant; platform unavailable/stale.

## 12. User actions
Create, edit, approve, reject with reason, duplicate as variant, link/unlink context, request alternatives within bounded count, send to execution/Pipeline, create experiment where appropriate.

## 13. State model
Feature-specific draft states must map cleanly into MASTER Content Unit state machine once a ContentUnit exists. Candidate/Angle states must not masquerade as production-ready content.

## 14. Business rules
- `CNT-EXP-001` Exploration MUST be visibly distinct from standard strategy generation.
- `CNT-EXP-002` Exploration MAY intentionally violate preferred patterns but MUST still respect non-negotiable rights/safety/hard identity constraints unless explicit deviation path exists.
- `CNT-EXP-003` System MUST NOT recommend alcohol/recreational substances as creative technique.
- `CNT-EXP-004` Prompts MAY use confession, surprise, empathy, humor, nostalgia, transformation, intimacy and experimental lenses.
- `CNT-EXP-005` Exploration output MUST remain candidates until human selection.
- `CNT-EXP-006` Wild ideas SHOULD not be promoted into validated best practice simply because selected.
- `CNT-EXP-007` Explore/Exploit labeling SHOULD be retained into resulting Angle/Experiment.
- `CNT-EXP-008` Adjacent test SHOULD differ less radically than Exploration and can reuse proven structure with one meaningful new dimension.
- `CNT-EXP-009` Session SHOULD end with convergence; it is not an infinite idea stream.

## 15. AI behavior
Generate intentionally diverse but artist-grounded ideas; label uncertainty and departure from known patterns. No substance-assisted ideation.

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
- `CNT-EXP-AC01` User can start exploration without changing global strategy.
- `CNT-EXP-AC02` Selected exploration idea becomes traceable Angle.
- `CNT-EXP-AC03` Unselected ideas do not clutter Pipeline.
- `CNT-EXP-AC04` No substance-assisted creative suggestion.
- `CNT-EXP-AC05` Explore/Adjacent/Exploit provenance survives.

## 31. Test matrix
Manual-only flow; strong context; cold-start context; missing Song/Campaign; AI outage; stale platform knowledge; identity conflict; duplicate idea; rejected idea regeneration; experiment-controlled variant.

## 32. Open questions
Exact exploration session batch size and clustering UX are implementation/product tuning details.

## 33. Traceability
§142–143, §312–313; MASTER Product Principles §16–27, Context §120–126, AI §322–338.
