# Identity Narrative

## 1. Metadata
- **Spec ID:** `IDN-NARR`
- **Domain:** `02_identity`
- **Feature:** Identity Narrative
- **Status:** REVIEW
- **MASTER references:** 83–85, 93–102, 386, 404, 450
- **Depends on:** draft Identity Version, Artist statements, optional Song/association evidence
- **Used by:** Narrative Tracks, Mystique, Anchors, Content Strategy, Brand Book, Owned Media

## 2. Purpose
Define the internal artistic world and core long-term story of the artist separately from campaign content pillars or platform formats.

## 3. User problem / job-to-be-done
**JTBD:** “Help me articulate the world, conflict, desire and themes behind my artist identity so future stories feel connected without forcing me to explain everything publicly.”

## 4. Scope
Title, premise, artist role, world, central conflict, core desire, themes, symbols, locations, eras, internal canon, audience-facing fragments. Mystique disclosure rules handled with related feature.

Out: Content Narrative Tracks themselves, Song story replacement, fictionalizing artist facts without labeling.

## 5. Entry points
`/identity/narrative`, Wizard, Identity Home.

## 6. Preconditions and dependencies
Draft Identity Version. Can be built from direct artist input; AI evidence optional.

## 7. Information architecture
Core premise → role/world → conflict/desire → themes → symbols/locations/eras → internal canon → audience-facing fragments → privacy/mystique review.

## 8. User roles and permissions
Artist is final authority for private truth and artistic canon.

## 9. Core data model
MASTER `IdentityNarrative` fields exactly. Internal canon and audience-facing fragments must be distinguishable and independently editable.

## 10. Main happy-path workflow
1. User writes/responds to guided prompts.
2. AI optionally synthesizes candidate narrative structure from supplied evidence.
3. User edits premise/conflict/desire/themes.
4. User marks internal canon facts and candidate public fragments.
5. Mystique Policy reviews what can be exposed.
6. Narrative is confirmed in draft Identity Version.

## 11. Alternative workflows
Minimal narrative with only premise/themes; highly fictional/art-world narrative clearly separated from biographical facts; version evolves with Era.

## 12. User actions
Create/edit sections, mark private/protected, link evidence/symbols, create audience fragment, approve/reject AI draft, compare versions.

## 13. State model
`EMPTY | DRAFT | CONFIRMED | REVIEW_REQUIRED`; audience fragments can have own `INTERNAL_ONLY | ALLOWED | ARCHIVED` treatment if implementation needs it.

## 14. Business rules
- **IDN-NARR-001** — Identity Narrative MUST remain distinct from Narrative Tracks, Content Pillars and Verticals.
- **IDN-NARR-002** — Internal canon MUST be separable from audience-facing fragments.
- **IDN-NARR-003** — AI MUST NOT invent biographical facts and present them as true artist history.
- **IDN-NARR-004** — Fictional/artistic-world elements MUST be distinguishable from factual artist statements when factual status matters.
- **IDN-NARR-005** — Protected facts MUST not flow to external outputs without explicit permission.
- **IDN-NARR-006** — Narrative can contain ambiguity/interpretive space and MUST NOT require exhaustive explanation.
- **IDN-NARR-007** — User can confirm a narrative even when not every field is populated.
- **IDN-NARR-008** — Symbols in Identity Narrative do not automatically become SymbolicAnchors; anchor workflow requires explicit promotion/definition.
- **IDN-NARR-009** — Locations/eras/themes MAY be artistic rather than literal and should support notes/context.
- **IDN-NARR-010** — Changes follow Identity Version rules and do not rewrite historical content narratives.
- **IDN-NARR-011** — Performance response can create hypotheses about narrative communication, not directly rewrite internal canon.
- **IDN-NARR-012** — Narrative generation must cite source Artist Statements/associations where it claims synthesis from evidence.
- **IDN-NARR-013** — External Brand Book mode MUST exclude protected internal canon and respect Mystique Policy.
- **IDN-NARR-014** — Audience-facing fragments remain reusable source material, not automatically published copy.
- **IDN-NARR-015** — Contradictory/dual themes may coexist when artist confirms them; system need not force a single simplistic persona.

## 15. AI behavior
Can structure/summarize artist-provided material and propose themes/conflicts. Output must label inferred suggestions and source refs. Forbidden: invented life events, forced hero-story templates, replacing protected meanings with generic marketing narrative.

## 16. Human approval
All narrative facts/canon and disclosure classification require human confirmation.

## 17. Validation
Version ownership; protected status; linked anchors/evidence valid; no external fragment references deleted source without warning.

## 18. UI states
Blank prompts, AI candidate, partial, confirmed, privacy warning, review required.

## 19. Edge cases
Artist intentionally uses fictional persona; songs contradict internal narrative; private relationship/person reference. Preserve scope and protection rather than flatten.

## 20. Cross-module effects
Feeds Narrative Architecture, Content Strategy, Brand Book, Website story and Context Capsule with disclosure filtering.

## 21. Notifications and attention model
Only privacy conflict/review-required after major version change; no cadence reminders.

## 22. Search / filtering / sorting / bulk actions
Search internal fragments/themes; no bulk public disclosure actions.

## 23. Analytics and product telemetry
AI draft acceptance/edit, protected fragment count, downstream use—not narrative “quality score.”

## 24. Learning feedback
Audience response can inform Narrative hypotheses/track analytics; identity canon remains human-controlled.

## 25. Auditability / provenance
Who authored/confirmed, source statements, protected/public changes, version history.

## 26. Desktop / mobile behavior
Desktop editing; mobile capture/quick edit and review.

## 27. Accessibility / usability
Long-form text readable, autosave, clear private/public indicators not color-only.

## 28. Security / privacy / rights
Internal canon is high-sensitivity product content; external integrations receive only minimum necessary filtered fragments.

## 29. Performance / async jobs
AI synthesis async if needed; manual editor always available.

## 30. Acceptance criteria
1. Internal canon and public fragments are distinct.
2. AI cannot silently invent biographical facts.
3. Protected facts excluded from external Brand Book.
4. Symbols do not auto-become anchors.
5. Narrative can be incomplete but confirmed where user chooses.
6. Changes version correctly.

## 31. Test matrix
Unit: disclosure/filtering. Integration: Brand Book/Context. Agent eval: no invented biography. E2E: narrative→mystique→external export.

## 32. Open questions
Whether fictional persona facts need a first-class epistemic tag inside Identity Narrative or can be handled by field-level metadata; data-model pass should decide.

## 33. Traceability
`IDN-NARR-001–015` → MASTER 83–85, 93–102, 386, 404, 450.
