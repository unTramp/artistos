# Editorial Pitch

- **Status:** REVIEW COMPLETE
- **MASTER references:** §227–230, §325, §406
- **Domain:** 11_dsp
- **Feature slug:** `editorial-pitch`
- **Requirement prefix:** `DSP-PIT`

## 2. Purpose
Prepare, validate and track platform editorial pitch submissions using factual Song/Release context and current platform requirements.

## 3. User problem / job-to-be-done
Editorial pitching is deadline-sensitive and often requires structured metadata/story/marketing-plan fields. Artists need grounded preparation without generic hype, fabricated claims or outdated platform form assumptions.

## 4. Scope
### In scope
- EditorialPitch fields from MASTER
- drafting from Song Brain/Release/Campaign
- deadline/eligibility checks
- structured review
- submission tracking/outcome

### Out of scope / non-goals
- guaranteed playlist placement
- automated portal submission unless future provider supports approved action
- fabricated marketing commitments

## 5. Entry points
- DSPOpportunity EDITORIAL_PITCH
- DSP Release Plan
- Release Readiness
- Song/Release

## 6. Preconditions and dependencies
- Song Brain
- Release metadata
- Campaign/Launch plan
- current platform pitch requirements/capability
- Identity/Tone corpus

## 7. Information architecture
Open verified pitch opportunity → assemble factual context → draft structured pitch → validate current platform fields/limits → user edits/approves → submit externally/manual → record submittedAt/evidence/outcome.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `EditorialPitch {platform, songId, releaseId, status, submittedAt?, deadline?, genre, mood, culture, instruments, story, marketingPlan, outcome?}`. Status/outcome enums and pitch-version history need schema definition.

## 10. Main happy-path workflow
1. Confirm eligibility/deadline
2. Context Assembler loads Song/Release/Campaign and current platform requirements
3. AI/user drafts pitch fields
4. System flags unsupported claims/missing required fields
5. User approves final text
6. Submit manually/provider if later supported
7. Record submittedAt and exact submitted snapshot
8. Record outcome when known

## 11. Alternative workflows
- no campaign/marketing plan
- instrument/genre field not applicable
- deadline missed
- platform form changes
- pitch edited externally after OS draft

## 12. User actions
- generate draft
- edit field
- open source requirement
- copy/export
- mark submitted
- attach proof
- record outcome

## 13. State model
Draft → review → submitted → outcome/closed, with missed/withdrawn possibilities; exact enum unresolved. Submitted snapshot becomes historical and is not overwritten by later edits.

## 14. Business rules
- `DSP-PIT-001` Editorial pitch MUST only be prepared for a current relevant opportunity or explicit manual workflow; it MUST NOT imply eligibility.
- `DSP-PIT-002` Deadline/field requirements MUST come from current platform capability/source where available.
- `DSP-PIT-003` Pitch content MUST be grounded in Song/Release/Artist/Campaign evidence.
- `DSP-PIT-004` AI MUST NOT invent press coverage, audience numbers, campaign budget, playlist support, instruments or cultural context.
- `DSP-PIT-005` ARTIST_INTERPRETATION and factual metadata MUST remain distinguishable when composing story fields.
- `DSP-PIT-006` MarketingPlan SHOULD describe actual approved/planned activity, not aspirational fiction presented as fact.
- `DSP-PIT-007` Submitted pitch snapshot MUST be preserved exactly enough for later review/outcome analysis.
- `DSP-PIT-008` Late/missed deadline MUST be shown honestly; OS MUST NOT manipulate submittedAt.
- `DSP-PIT-009` Outcome absence MUST remain unknown and MUST NOT be treated as rejection.
- `DSP-PIT-010` Editorial outcome MUST NOT automatically change identity/content strategy.
- `DSP-PIT-011` One successful/failed pitch MUST NOT become a validated general pitching rule.
- `DSP-PIT-012` AI drafting SHOULD respect platform length/field constraints when verified current.
- `DSP-PIT-013` No “guaranteed editorial placement” language may be generated.

## 15. AI behavior
AI uses Context Request for Song/Release/Campaign/platform and structured pitch schema. It drafts concise factual fields, cites source context internally, flags uncertain/missing facts, and asks for user input rather than inventing proof.

## 16. Human approval
Final text and external submission are human-approved. Marking submitted is a factual user/provider assertion with audit.

## 17. Validation
- song/release match
- deadline current
- required fields valid
- length constraints current if known
- no unsupported factual claims

## 18. UI states
- not eligible/unknown
- draft
- review
- ready
- submitted
- deadline missed
- outcome unknown
- outcome recorded

## 19. Edge cases
- platform changes form
- release date moves
- artist has no marketing spend
- cover song
- cultural field sensitive/uncertain
- submission made directly outside OS

## 20. Cross-module effects
- Song Brain
- Release
- Campaign
- DSP Opportunity
- Release Readiness
- Research Claims
- Decisions/Analytics

## 21. Notifications and attention model
- pitch deadline approaching
- required field missing
- eligibility stale

## 22. Search / filtering / sorting / bulk actions
Filter pitches by platform/release/status/deadline/outcome. No bulk pitch submission.

## 23. Analytics and product telemetry
- draft generated
- field edited
- unsupported claim removed
- submitted
- outcome recorded

## 24. Learning feedback
Pitch/outcome history may produce hypotheses after sufficient cases, but individual outcome is not causal proof.

## 25. Auditability / provenance
Preserve exact submitted text/fields, requirement/source version, actor/time, proof and later outcome.

## 26. Desktop / mobile behavior
Desktop drafting/review; mobile copy/view deadline/mark submitted.

## 27. Accessibility / usability
Clear source vs draft distinction, character counters where requirements verified, keyboard-friendly structured form.

## 28. Security / privacy / rights
Avoid exposing private internal canon unless artist explicitly chooses it. No fabrication of third-party endorsements or metrics.

## 29. Performance / async jobs
AI drafting async optional; all core form editing/copy works without AI.

## 30. Acceptance criteria
- `DSP-PIT-AC01` AI does not invent campaign facts.
- `DSP-PIT-AC02` Submitted snapshot is immutable/history-preserved.
- `DSP-PIT-AC03` Missed deadline remains missed.
- `DSP-PIT-AC04` Unknown outcome is not rejection.
- `DSP-PIT-AC05` Current verified field/length constraints are used when available.

## 31. Test matrix
- late deadline
- no campaign plan
- form changed
- manual external submission
- cover release
- unknown outcome

## 32. Open questions
- Pitch status/outcome enums and version entity need schema definition.

## 33. Traceability
MASTER §227–230, §325, §406
