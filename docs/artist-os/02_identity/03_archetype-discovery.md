# Archetype Discovery

## 1. Metadata
- **Spec ID:** `IDN-ARCH`
- **Domain:** `02_identity`
- **Feature:** Archetype Discovery
- **Status:** REVIEW
- **MASTER references:** 58–60, 92, 404
- **Depends on:** Artist statements, optional lyrics/music/visual/external feedback evidence
- **Used by:** Identity Wizard, Identity Home, Identity Capsule

## 2. Purpose
Use archetypes as an optional creative vocabulary to help articulate recurring artistic role/energy while grounding suggestions in evidence and human interpretation.

## 3. User problem / job-to-be-done
**JTBD:** “Help me name a coherent creative role or archetypal direction from my real material without pretending to diagnose my personality.”

## 4. Scope
Primary/secondary archetype candidates, evidence collection, rationale, confidence, human confirmation. Out: personality diagnosis, audience psychographics, deterministic branding templates.

## 5. Entry points
`/identity/discovery/archetype`, Wizard, Identity Home edit.

## 6. Preconditions and dependencies
Draft Identity Version. Evidence may include personality self-statements, lyrics, music notes, visual references and external feedback.

## 7. Information architecture
```text
Intro / model disclaimer
Evidence inputs
Candidate archetypes
Candidate detail + evidence
Compare candidates
Confirm / defer
```

## 8. User roles and permissions
Human artist confirms. AI suggests only.

## 9. Core data model
```text
ArchetypeProfile
primaryArchetype
secondaryArchetype?
confidence
status
personalityEvidence[]
lyricEvidence[]
musicEvidence[]
visualEvidence[]
externalFeedback[]
```
Archetype enum is the 12 MASTER values.

## 10. Main happy-path workflow
1. Explain archetype as creative model.
2. User selects/provides evidence or reuses existing Artist/Song/Identity material.
3. AI or guided questionnaire generates candidate set with rationale/evidence.
4. User compares candidates.
5. User chooses primary, optional secondary, edits rationale or defers.
6. Confirmed profile saves to current draft Identity Version.

## 11. Alternative workflows
Manual archetype selection without AI; no archetype chosen; one candidate only if user explicitly selects; later revision in new/same draft version.

## 12. User actions
Add evidence, remove evidence, request analysis, inspect candidate, confirm primary/secondary, reject candidate, defer.

## 13. State model
```text
EMPTY → EVIDENCE_READY → CANDIDATES → CONFIRMED
                           ↘ DEFERRED
CONFIRMED → REVIEW_REQUIRED (when evidence/identity version changes materially)
```

## 14. Business rules
- **IDN-ARCH-001** — Archetype MUST be presented as a creative model, never psychological diagnosis.
- **IDN-ARCH-002** — AI MUST produce candidates with rationale/evidence, not a single unexplained answer.
- **IDN-ARCH-003** — Final primary archetype MUST require human confirmation.
- **IDN-ARCH-004** — Secondary archetype is optional.
- **IDN-ARCH-005** — User may defer archetype selection without blocking other Identity work.
- **IDN-ARCH-006** — Confidence MUST reflect evidence quality/coverage and MUST NOT imply scientific personality certainty.
- **IDN-ARCH-007** — Evidence MUST retain category and source reference where possible.
- **IDN-ARCH-008** — External feedback MUST be distinguishable from artist self-statement.
- **IDN-ARCH-009** — Contradictory evidence SHOULD be visible rather than discarded to make a cleaner story.
- **IDN-ARCH-010** — Archetype choice MUST NOT automatically populate non-negotiable visual/narrative rules.
- **IDN-ARCH-011** — Archetype changes MUST follow Identity Version rules and must not rewrite historical content.
- **IDN-ARCH-012** — AI MUST not infer mental state, intelligence, pathology or demographic identity from artistic material.
- **IDN-ARCH-013** — Candidate evidence may include lyrics/music/visuals only when linked to the correct artist/song/context.
- **IDN-ARCH-014** — Rejected candidates MAY be retained as audit/eval history but are excluded from active Identity Capsule.
- **IDN-ARCH-015** — Candidate generation must support insufficient-evidence output.

## 15. AI behavior
Context: evidence arrays + Artist summary + optional selected materials. Output: 2–4 candidates ideally, each `{archetype, rationale, supportingEvidence[], contradictoryEvidence[], confidence, uncertainties[]}`. No diagnosis. If evidence weak, say so.

## 16. Human approval
Required to set primary/secondary.

## 17. Validation
Enum valid; no duplicate primary=secondary; evidence source exists; draft version ownership valid.

## 18. UI states
No evidence, analyzing, candidates, confirmed, deferred, low evidence, error.

## 19. Edge cases
Strong evidence for multiple archetypes → allow nuanced comparison. User manually chooses low-AI-confidence candidate → accept as human creative decision and record that it is user-selected.

## 20. Cross-module effects
Confirmed profile updates Identity Capsule and may influence future strategy suggestions, never hard-constrain them unless separate constraints exist.

## 21. Notifications and attention model
No recurring alert for deferred archetype. Only surface if current workflow explicitly needs Identity review.

## 22. Search / filtering / sorting / bulk actions
Evidence can filter by source category. No bulk candidate confirmation.

## 23. Analytics and product telemetry
Candidate acceptance/edit/reject, evidence types used, defer rate, time to decision.

## 24. Learning feedback
Archetype evidence is Identity evidence, not audience/performance learning.

## 25. Auditability / provenance
Store candidate output/config, evidence refs, confirmed actor/time.

## 26. Desktop / mobile behavior
Both usable; evidence-heavy compare view optimized for desktop.

## 27. Accessibility / usability
Explain all 12 archetypes in plain language; avoid stereotyped imagery as the only explanation.

## 28. Security / privacy / rights
Private evidence stays internal; external Brand Book shows archetype only if allowed, not private evidence.

## 29. Performance / async jobs
Analysis can be background job; manual selection works without AI.

## 30. Acceptance criteria
1. User can complete with AI or manually.
2. Candidate rationale references actual evidence.
3. Weak evidence produces uncertainty.
4. No candidate auto-confirms.
5. User can defer.
6. Historical content is unaffected by later archetype changes.

## 31. Test matrix
Unit: enum/validation. Agent eval: evidence grounding, no diagnosis, contradictory evidence. E2E: evidence → candidates → confirm → Identity Home.

## 32. Open questions
Whether confidence should be categorical rather than numeric. Recommended: categorical + explanation to avoid fake precision.

## 33. Traceability
`IDN-ARCH-001–015` → MASTER 58–60, 92, 404.
