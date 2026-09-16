# Signature Differentiators

## 1. Metadata
- **Spec ID:** `NAR-DIFF`
- **Domain:** `03_narrative`
- **Feature:** Signature Differentiators / X-factor
- **Status:** REVIEW
- **MASTER references:** 81–82, 97–98, 128, 145–147, 405, 450–452
- **Depends on:** Identity Version; optional Narrative Tracks, Verticals, Anchors, Content history
- **Used by:** Content Factory, Production, Narrative planning, Brand/Identity Guard, Fatigue analysis

## 2. Purpose
Capture recognizable creative differentiators that can recur across storytelling and production without forcing them to become a separate storyline.

## 3. User problem / job-to-be-done
**JTBD:** “Help me preserve the distinctive things people can recognize as mine — an object, behavior, instrument, sound, visual device, phrase or format — while knowing when I am overusing them.”

## 4. Scope
Creation, categorization, vertical applicability, usage rules, importance, fatigue risk and usage visibility.

Out: psychological symbolism claims, automatic trademark rights, mandatory branding elements.

## 5. Entry points
Narrative → Differentiators, Identity Anchors, Content Factory, Brand Book, Weekly Review fatigue signal.

## 6. Preconditions and dependencies
Identity Version exists. Differentiator can be proposed from confirmed Identity material or manually created.

## 7. Information architecture
Library + detail page:
- Name/type/description.
- Identity linkage.
- Importance.
- Applicable Verticals.
- Usage rules.
- Current fatigue state.
- Recent usages/content.
- Related Anchor/Track where relevant.

## 8. User roles and permissions
Artist confirms creation/retirement/meaning. Future collaborators can receive external usage guidance.

## 9. Core data model
MASTER `SignatureDifferentiator`:
```text
name
type: INSTRUMENT|CHARACTER|OBJECT|VISUAL|BEHAVIOR|FORMAT|SOUND|PHRASE|OTHER
description
identityVersionId
importance
applicableVerticals[]
usageRules
fatigueRisk
```

## 10. Main happy-path workflow
1. User creates or accepts a candidate differentiator.
2. Selects type and describes what makes it distinctive.
3. Sets importance and applicable Verticals.
4. Adds usage/avoidance rules.
5. System shows recent similar usage if available.
6. User confirms.
7. Differentiator becomes available to Factory/Production context.
8. Usage is tracked through Content lineage/tags where available.
9. Fatigue signals inform, but do not automatically retire, the differentiator.

## 11. Alternative workflows
Promote from Symbolic Anchor; create purely sonic differentiator; create temporary Era-specific execution note via Era/Identity constraints rather than permanent differentiator.

## 12. User actions
Create, edit, link to related Anchor/Track context, update applicable Verticals/rules, mark dormant/retired if implementation adds lifecycle, inspect usages/fatigue, include/exclude from external Brand Book guidance.

## 13. State model
MASTER does not define a status field. MVP may treat differentiators as active records with archival metadata at repository level; a first-class lifecycle SHOULD NOT be invented until schema pass confirms it.

## 14. Business rules
- **NAR-DIFF-001** — Signature Differentiator MUST remain conceptually separate from Narrative Track.
- **NAR-DIFF-002** — X-factor/differentiator MUST NOT be forced into a `SECONDARY` or “C-storyline”.
- **NAR-DIFF-003** — Differentiator MUST reference the Identity Version that defines its meaning/context.
- **NAR-DIFF-004** — `type` MUST use MASTER enum or `OTHER`.
- **NAR-DIFF-005** — Differentiator MAY apply across multiple Narrative Tracks.
- **NAR-DIFF-006** — Differentiator MAY apply across multiple Content Verticals.
- **NAR-DIFF-007** — Applicability to a Vertical MUST NOT imply mandatory use in every execution of that Vertical.
- **NAR-DIFF-008** — Usage rules SHOULD define when/how to use and when to avoid, not only a positive description.
- **NAR-DIFF-009** — Stable recognizable identity repetition MUST be distinguished from low-value execution repetition.
- **NAR-DIFF-010** — Reusing a differentiator MUST NOT automatically lower Novelty.
- **NAR-DIFF-011** — Fatigue MUST consider execution similarity/frequency/response/sample size, not mere recurrence of identity anchor/differentiator.
- **NAR-DIFF-012** — Fatigue signals MUST NOT automatically remove or prohibit a differentiator.
- **NAR-DIFF-013** — A differentiator MAY intentionally be high-frequency if artist confirms it as a signature behavior.
- **NAR-DIFF-014** — Symbolic Anchor and Signature Differentiator MAY reference the same object/behavior but MUST preserve their different purposes: meaning vs differentiation/execution.
- **NAR-DIFF-015** — The system MUST NOT assert subconscious/psychological audience effects as fact solely because an object/symbol recurs.
- **NAR-DIFF-016** — Rights constraints MUST apply when the differentiator involves third-party characters, logos, sounds or protected material.
- **NAR-DIFF-017** — AI MUST NOT create a differentiator by copying a competitor's distinctive protected execution as the artist's own signature.
- **NAR-DIFF-018** — Usage analytics MAY inform fatigue or opportunity but MUST NOT redefine Identity meaning automatically.
- **NAR-DIFF-019** — Differentiator guidance passed to Production MUST respect actual capability and context.
- **NAR-DIFF-020** — Historical Content retains the Identity Version/differentiator context that was active at creation.
- **NAR-DIFF-021** — External Brand Book guidance MUST exclude internal rationale if marked protected.
- **NAR-DIFF-022** — Importance MUST be explainable as artist-defined/editorial priority, not a fabricated quantitative effectiveness score.

## 15. AI behavior
AI may propose differentiators from repeated confirmed patterns in Identity/moodboard/content, but must label these as candidates. It should cite observed recurrence and distinguish artistic meaning from pattern frequency.

Forbidden: pseudo-psychological claims, competitor cloning, declaring recurrence as causal success, automatic promotion.

## 16. Human approval
Required to confirm a candidate differentiator, change its meaning/importance, or expose it in external guidance.

## 17. Validation
Identity linkage; allowed type; valid Vertical references; rights warnings; conflicting Identity constraints.

## 18. UI states
No differentiators; candidate; active record; limited usage evidence; fatigue watch/saturated context; rights warning; historical Identity context.

## 19. Edge cases
A signature item intentionally disappears for an Era; differentiator only works live; visual object has symbolic meaning but is not always visible; audience begins imitating a phrase.

## 20. Cross-module effects
Provides context to Factory/Production/Guard and contributes to novelty/fatigue interpretation. Does not mutate Tracks automatically.

## 21. Notifications and attention model
Only meaningful fatigue/rights/conflict signals; no reminder to “use your signature” on a fixed cadence.

## 22. Search / filtering / sorting / bulk actions
Filter by type/Vertical/fatigue state/Identity Version. Search name/description. Bulk edit limited to safe tagging.

## 23. Analytics and product telemetry
Candidate acceptance, downstream use, manual rule edits, fatigue signal overrides. No magic effectiveness score.

## 24. Learning feedback
Repeated response can generate scoped hypotheses about execution value/fatigue. Differentiator meaning remains artist-controlled.

## 25. Auditability / provenance
Creation source, artist confirmation, AI pattern evidence, usage-rule edits and rights overrides.

## 26. Desktop / mobile behavior
Desktop library/editor; mobile read/quick-select in production/content flows.

## 27. Accessibility / usability
Type/fatigue states text-labeled; examples include accessible descriptions.

## 28. Security / privacy / rights
Protected rationale and third-party rights metadata filtered appropriately.

## 29. Performance / async jobs
Pattern suggestion/similarity can be async; manual CRUD immediate.

## 30. Acceptance criteria
1. Differentiator exists independently of Track.
2. Repetition of signature element is not automatically treated as low novelty.
3. Fatigue does not auto-retire it.
4. Symbolic meaning and execution differentiation are distinguishable.
5. AI candidates cite observed patterns and require approval.
6. Rights conflicts are surfaced.

## 31. Test matrix
Unit: enum/Vertical validation. Integration: Factory/Guard/fatigue. Agent eval: no pseudo-science/competitor copying. E2E: Identity → differentiator → content use → fatigue signal.

## 32. Open questions
Whether Differentiator needs explicit lifecycle (`ACTIVE/DORMANT/RETIRED`) in schema; MASTER does not define status, so defer to data-model review.

## 33. Traceability
`NAR-DIFF-001–022` → MASTER 81–82, 97–98, 128, 145–147, 405, 450–452.
