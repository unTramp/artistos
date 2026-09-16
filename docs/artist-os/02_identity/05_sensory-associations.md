# Sensory Associations & Candidate Review

## 1. Metadata
- **Spec ID:** `IDN-ASSOC`
- **Domain:** `02_identity`
- **Feature:** Sensory Associations & Candidate Review
- **Status:** REVIEW
- **MASTER references:** 63–64, 67–68, 92, 404
- **Depends on:** Listening Sessions, optional Moodboard analysis, draft Identity Version
- **Used by:** Visual DNA, Identity Narrative, Symbolic Anchors

## 2. Purpose
Turn raw artist associations into a reviewed, traceable set of identity evidence without confusing recurrence with truth.

## 3. User problem / job-to-be-done
**JTBD:** “Help me see recurring imagery and feelings in my own responses, then let me decide what actually belongs in my artistic language.”

## 4. Scope
Candidate list, clustering, occurrence count, confidence, merge/edit/confirm/reject/protect. Out: automatic Visual DNA or anchor creation.

## 5. Entry points
`/identity/discovery/associations`, Listening Session completion, Moodboard pattern cross-reference.

## 6. Preconditions and dependencies
Draft identity; associations may come from session/manual/analysis source.

## 7. Information architecture
Tabs/filters by type; candidate cards show value, sources, occurrence, confidence, status. Review drawer shows all evidence and downstream suggestions.

## 8. User roles and permissions
Human confirmation required.

## 9. Core data model
MASTER `SensoryAssociation`:
```text
sessionId
identityVersionId
songId?
type
value
confidence
occurrenceCount
status
```
Types: COLOR, TEXTURE, OBJECT, PLACE, MEMORY, SYMBOL, LIGHTING, EMOTION, MATERIAL, ERA, WEATHER, MOVEMENT, PERSON, OTHER.

Suggested statuses: `CANDIDATE | CONFIRMED | REJECTED | PROTECTED | MERGED` as product elaboration; engineering may model protection separately.

## 10. Main happy-path workflow
1. System aggregates candidates from sessions/manual sources.
2. Similar values may be suggested as clusters.
3. User opens candidate and inspects source occurrences.
4. User edits wording/type or merges duplicates.
5. User confirms meaningful associations, rejects noise, protects private items.
6. Confirmed associations become available to Visual DNA/Narrative/Anchor workflows as evidence, not automatic rules.

## 11. Alternative workflows
Manual-only candidates; one-off meaningful association confirmed despite low recurrence; recurring association rejected by artist; same word kept as separate meanings.

## 12. User actions
Confirm, reject, edit, merge, unmerge if reversible, protect/unprotect, change type, inspect source, create downstream candidate.

## 13. State model
`CANDIDATE → CONFIRMED | REJECTED | MERGED`; protection can overlay candidate/confirmed depending implementation. Changes in a new Identity Version create version-specific records/links.

## 14. Business rules
- **IDN-ASSOC-001** — All extracted associations begin as candidates.
- **IDN-ASSOC-002** — Confirmation requires human action.
- **IDN-ASSOC-003** — Occurrence count is evidence context, not a rule that high frequency must be accepted.
- **IDN-ASSOC-004** — A low-frequency association may be confirmed when the artist considers it important.
- **IDN-ASSOC-005** — Similarity clustering MUST preserve source occurrences and original values.
- **IDN-ASSOC-006** — Merge MUST be auditable/reversible before downstream publication where practical.
- **IDN-ASSOC-007** — Private `MEMORY`/`PERSON`/other associations MUST support protected handling.
- **IDN-ASSOC-008** — Confirmed association does not automatically become SymbolicAnchor or VisualPattern.
- **IDN-ASSOC-009** — Confidence MUST describe extraction/support confidence, not psychological certainty.
- **IDN-ASSOC-010** — Song-specific associations MUST retain song linkage and must not automatically generalize artist-wide.
- **IDN-ASSOC-011** — Rejected candidates are excluded from active Identity Capsule and downstream suggestions unless explicitly reviewed historically.
- **IDN-ASSOC-012** — Contradictory associations MAY coexist; the UI should allow contrast as an identity signal.
- **IDN-ASSOC-013** — Downstream conversion to visual/narrative/anchor candidate MUST retain provenance.
- **IDN-ASSOC-014** — Values may be artist-entered in any language; normalization must not silently erase original wording.
- **IDN-ASSOC-015** — AI must not infer protected sensitive personal attributes from associations.

## 15. AI behavior
Allowed: extract, deduplicate/cluster, suggest types, summarize contrasts. Structured output includes source IDs and confidence. Forbidden: confirm, convert recurrence into causal claims, infer psychology.

## 16. Human approval
Confirm/reject/merge and protected status are human-controlled.

## 17. Validation
Type enum, version scope, source validity, occurrence recomputation, protected data handling.

## 18. UI states
No candidates, candidates, filtered, low-confidence, protected, merged, processing/error.

## 19. Edge cases
Color “blue” means sadness in one song and sea in another → keep separate semantic candidates if meanings differ. Deleted source session → preserve derived item with provenance warning/audit policy.

## 20. Cross-module effects
Confirmed associations are queryable by Visual DNA/Narrative/Anchors; no direct identity rule emitted.

## 21. Notifications and attention model
No alerts for unreviewed low-priority candidates; Wizard can show candidate review as next step.

## 22. Search / filtering / sorting / bulk actions
Filter by type/song/status/source; sort by occurrence/recent/confidence. Bulk reject allowed with confirmation; bulk confirm should be conservative and show items.

## 23. Analytics and product telemetry
Acceptance/edit/merge/reject, cluster quality corrections, time to review.

## 24. Learning feedback
Identity evidence only.

## 25. Auditability / provenance
Original value, source spans, extraction run, edits, merge history, actor.

## 26. Desktop / mobile behavior
Mobile quick review; desktop richer evidence comparison.

## 27. Accessibility / usability
Do not rely solely on visual chips/colors; text labels for association type and status.

## 28. Security / privacy / rights
Protected values excluded from external outputs by default.

## 29. Performance / async jobs
Clustering may run async for large sets; manual review remains available.

## 30. Acceptance criteria
1. Every AI association starts candidate.
2. User can inspect sources.
3. Recurrence never auto-confirms.
4. Song-specific evidence stays song-scoped.
5. Protected items are excluded from external-facing outputs.
6. Merge retains provenance.

## 31. Test matrix
Unit: status/merge/scoping. Integration: Listening→Associations→Visual DNA candidate. Agent eval: clustering without semantic collapse.

## 32. Open questions
Protection as status vs separate visibility field should be decided in data model audit; separate visibility is likely cleaner.

## 33. Traceability
`IDN-ASSOC-001–015` → MASTER 63–64, 67–68, 92, 404.
