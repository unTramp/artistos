# Symbolic Anchors

## 1. Metadata
- **Spec ID:** `IDN-ANCH`
- **Domain:** `02_identity`
- **Feature:** Symbolic Anchors
- **Status:** REVIEW
- **MASTER references:** 81–82, 97–98, 145–147, 278, 404
- **Depends on:** draft Identity Version, associations/narrative/visual evidence
- **Used by:** Vertical Rules, Content Factory, Production, Guard, Merch, Brand Book

## 2. Purpose
Define recurring artistic symbols, objects, motifs or behaviors with intended meaning and controlled usage so they create continuity without becoming repetitive gimmicks.

## 3. User problem / job-to-be-done
**JTBD:** “Help me intentionally reuse recognizable elements that carry meaning across my work, while tracking context and fatigue instead of repeating them blindly.”

## 4. Scope
Anchor creation, category, meaning/origin, importance, frequency guidance, visibility, allowed verticals, variations, usage history/fatigue linkage.

Out: claims of subconscious manipulation; automatic placement in every content unit.

## 5. Entry points
`/identity/anchors`, Wizard, Narrative/association promotion, Identity Home.

## 6. Preconditions and dependencies
Draft Identity Version. Anchor may be manually invented or promoted from confirmed evidence.

## 7. Information architecture
Anchor library/cards → detail → meaning/origin → usage scope → variations → examples/history → fatigue/context.

## 8. User roles and permissions
Artist confirms anchor and usage policy.

## 9. Core data model
MASTER `SymbolicAnchor` fields. `category` can remain extensible; exact enum not fixed in MASTER. Usage history is derived from Content/Asset lineage rather than stored as duplicate truth where possible.

## 10. Main happy-path workflow
1. Create anchor manually or from candidate association/narrative symbol.
2. Define name/category/intended meaning/narrative origin.
3. Set importance, desired usage frequency, visibility and allowed verticals.
4. Add acceptable variations.
5. Confirm anchor in current Identity Version.
6. Future Content/Production can reference it; analytics can track fatigue without auto-retiring it.

## 11. Alternative workflows
Private/internal anchor; Era-specific new anchor; retired anchor preserved historically; experimental anchor not yet strong enough for global identity.

## 12. User actions
Create/edit, confirm, set visibility, add variation, scope verticals, retire in Era/version, inspect usages, approve creative exception.

## 13. State model
Suggested `DRAFT | ACTIVE | RETIRED` within version/era context; historical version link remains immutable.

## 14. Business rules
- **IDN-ANCH-001** — Anchor MUST store intended meaning/association, not pseudoscientific causal claims.
- **IDN-ANCH-002** — Creating an anchor requires explicit human confirmation.
- **IDN-ANCH-003** — Anchor MAY originate from evidence or direct creative decision; provenance must distinguish the two.
- **IDN-ANCH-004** — Anchor MUST support scoped allowed verticals and visibility.
- **IDN-ANCH-005** — Anchor usage is optional unless a separate NON_NEGOTIABLE/STRONG constraint explicitly requires it.
- **IDN-ANCH-006** — Anchor variations MUST be allowed so identity repetition is not treated as exact execution repetition.
- **IDN-ANCH-007** — Fatigue signals MUST NOT automatically delete/retire an anchor.
- **IDN-ANCH-008** — Anchor fatigue should consider execution similarity/frequency/context, not mere existence of the motif.
- **IDN-ANCH-009** — Private/protected anchor meaning MUST be filtered from external outputs where Mystique/visibility requires it.
- **IDN-ANCH-010** — Era may add/retire anchors without rewriting prior-era history.
- **IDN-ANCH-011** — A Narrative symbol does not become an active anchor automatically.
- **IDN-ANCH-012** — Anchor can be referenced by Merch/Website/etc. only when rights/production constraints allow.
- **IDN-ANCH-013** — System MUST distinguish anchor identity consistency from overused exact setup/pose/object execution.
- **IDN-ANCH-014** — AI may suggest anchor usage but MUST not frame it as hidden psychological manipulation.
- **IDN-ANCH-015** — Usage analytics must preserve sample size/context and cannot declare anchor universally “works” from a single post.

## 15. AI behavior
Can suggest candidate anchors, variations and appropriate vertical uses from confirmed identity evidence. Must provide rationale/source and avoid causal manipulation claims.

## 16. Human approval
Anchor activation, meaning, protected/public visibility and retirement are human-controlled.

## 17. Validation
Version ownership; allowed vertical values; importance/frequency semantics; variations non-empty; protected visibility compatible with external use.

## 18. UI states
No anchors, draft, active, retired, fatigue watch, protected.

## 19. Edge cases
Anchor is a trademarked/third-party object → rights warning; recurring instrument is both SignatureDifferentiator and Anchor → allow cross-link, don't duplicate meanings blindly.

## 20. Cross-module effects
Content/Production suggestions can cite anchor; Guard checks required/forbidden usage; usage lineage informs fatigue analytics.

## 21. Notifications and attention model
Only fatigue WATCH/SATURATED or rights/constraint conflict when relevant to active production; no generic reminders to use anchors.

## 22. Search / filtering / sorting / bulk actions
Filter active/retired, category, era, vertical. Bulk retirement should require confirmation and version/era semantics.

## 23. Analytics and product telemetry
Anchor creation/edit, suggestion acceptance, usage count, Guard warnings, fatigue signals.

## 24. Learning feedback
Anchor performance creates hypotheses; retirement/change requires human decision/Identity process.

## 25. Auditability / provenance
Meaning/origin, source evidence, version, visibility changes, usage references.

## 26. Desktop / mobile behavior
Both; desktop richer history/usage visualization.

## 27. Accessibility / usability
Textual descriptions accompany visual symbols; don't require image recognition to understand anchor.

## 28. Security / privacy / rights
Protected meanings filtered; third-party rights warnings maintained.

## 29. Performance / async jobs
Usage/fatigue summaries can be derived asynchronously; anchor editor synchronous.

## 30. Acceptance criteria
1. Anchor stores meaning and origin.
2. Narrative symbol does not auto-activate.
3. Variations are supported.
4. Fatigue never auto-retires.
5. Protected meaning excluded externally.
6. Historical usage retains old version/era.

## 31. Test matrix
Unit: visibility/scope. Integration: Guard/fatigue/merch. Agent eval: no manipulation claims. E2E: association→anchor→content use→fatigue signal.

## 32. Open questions
Exact category enum should remain extensible until real usage proves stable categories.

## 33. Traceability
`IDN-ANCH-001–015` → MASTER 81–82, 145–147, 278, 404.
