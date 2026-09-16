# Moodboard

## 1. Metadata
- **Spec ID:** `IDN-MOOD`
- **Domain:** `02_identity`
- **Feature:** Moodboard
- **Status:** REVIEW
- **MASTER references:** 65–68, 181–185, 349, 404
- **Depends on:** Assets/Storage, rights metadata, draft Identity Version, Analyze Moodboard job
- **Used by:** Visual DNA, Brand Book references, Identity Wizard

## 2. Purpose
Collect and analyze visual references as evidence for a coherent visual identity while keeping likes/dislikes, rights and human interpretation explicit.

## 3. User problem / job-to-be-done
**JTBD:** “Let me gather images that feel like my artistic world, explain what I do and don’t like, and identify recurring patterns without copying a reference or losing control to AI.”

## 4. Scope
Moodboard create/manage, items via uploaded asset/source URL/reference, tags, like reason/disliked elements, rights/source type, AI pattern analysis, candidate pattern review.

Out: publishing reference imagery, automatic plagiarism/copying, auto-committing Visual DNA.

## 5. Entry points
`/identity/moodboard`, Wizard, Identity Home.

## 6. Preconditions and dependencies
Draft Identity Version; storage/source URL capability. Rights status may be unknown/reference-only because Moodboard can contain references not intended for publication.

## 7. Information architecture
```text
Moodboards list/selector
Moodboard canvas/grid
Add reference
Item detail
AI Analyze
Pattern results
Candidate review
```

## 8. User roles and permissions
Artist controls board/items/analysis acceptance.

## 9. Core data model
MASTER:
```text
Moodboard { id, identityVersionId, name, status, createdAt }
MoodboardItem {
 imageAssetId? sourceUrl? sourceType
 userTags[] aiTags[] likedReason dislikedElements[] rightsStatus
}
VisualPattern { type, value, frequency, confidence, sourceItemIds[] }
```

Suggested Moodboard status: `DRAFT | ACTIVE_REFERENCE | ARCHIVED` as product elaboration, not identity version status.

## 10. Main happy-path workflow
1. User creates/opens Moodboard.
2. Adds references by upload/asset/source URL.
3. For useful references, records `likedReason` and optionally `dislikedElements`.
4. User tags items or accepts/edits AI tags.
5. Runs Analyze Moodboard.
6. Job identifies recurring colors/textures/lighting/composition/fashion/objects/eras/materials/typography/art style/environment with source items.
7. User reviews pattern candidates and accepts/edits/rejects them for Visual DNA work.

## 11. Alternative workflows
Manual board without AI; multiple boards for different explorations/eras; reference-only URL with unknown rights; board archived after direction rejected.

## 12. User actions
Create/rename/archive board; add/remove/reorder item; tag; annotate like/dislike; set/update rights/source; analyze/reanalyze; inspect pattern; accept/edit/reject pattern candidate.

## 13. State model
Moodboard lifecycle independent of Identity Version. Analysis jobs have `QUEUED/ANALYZING/DONE/FAILED`; patterns remain suggestions until downstream confirmation.

## 14. Business rules
- **IDN-MOOD-001** — Moodboard references MUST belong to a specific Identity Version.
- **IDN-MOOD-002** — Moodboard items MAY be reference-only and need not be publishable assets.
- **IDN-MOOD-003** — Source URL/source type/rights status MUST be retained when known.
- **IDN-MOOD-004** — Credit or source attribution MUST NOT be treated as proof of publication rights.
- **IDN-MOOD-005** — User `likedReason` and `dislikedElements` MUST be preserved separately from AI tags.
- **IDN-MOOD-006** — AI tags MUST be distinguishable from user tags.
- **IDN-MOOD-007** — Visual patterns MUST reference supporting Moodboard items.
- **IDN-MOOD-008** — AI pattern analysis MUST produce suggestions, not directly modify confirmed Visual DNA.
- **IDN-MOOD-009** — Pattern frequency MUST not be presented as universal design correctness.
- **IDN-MOOD-010** — Removing an item MUST update/recompute pattern support but MUST not silently delete already confirmed Visual DNA decisions.
- **IDN-MOOD-011** — `dislikedElements` MUST influence pattern interpretation so AI does not recommend a recurring element the user explicitly rejects.
- **IDN-MOOD-012** — Duplicate/near-duplicate references SHOULD be flagged to avoid frequency inflation.
- **IDN-MOOD-013** — Multiple Moodboards MAY coexist for exploration; only confirmed Identity data determines active Visual DNA.
- **IDN-MOOD-014** — Moodboard analysis MUST support insufficient/low-diversity evidence rather than inventing a rich pattern system.
- **IDN-MOOD-015** — Analysis output MUST avoid instructing direct copying of protected reference artwork/photography.
- **IDN-MOOD-016** — Generated imagery, if used as reference, MUST retain `AssetOrigin=GENERATED` and not masquerade as original artist photography.
- **IDN-MOOD-017** — Rights status affects downstream publication, not the ability to keep a private reference board.
- **IDN-MOOD-018** — Analysis is versioned/re-runnable; previous analysis results remain traceable.

## 15. AI behavior
Image/reference analysis can tag recurring visual attributes. Output pattern includes `{type,value,frequency,confidence,sourceItemIds,rationale,conflicts/dislikedEvidence}`. It must not claim copyright clearance or causal psychological effect.

## 16. Human approval
Required before a pattern influences confirmed Visual DNA. AI tags can be accepted/edited/rejected.

## 17. Validation
At least asset or URL; no invalid source refs; rights enum valid; pattern source IDs belong to board/version; duplicate detection should not block adding intentionally repeated reference.

## 18. UI states
Empty board, populated, upload, broken URL/reference, analyzing, analysis complete, insufficient evidence, failed analysis, archived.

## 19. Edge cases
Reference disappears online; save metadata/thumbnail only if rights/privacy policies allow. Same item liked for lighting but disliked for fashion: preserve both. Fonts in image are references, not licensed assets.

## 20. Cross-module effects
Accepted pattern candidates feed Visual DNA review. Items may reuse Asset library objects with rights metadata.

## 21. Notifications and attention model
Analysis completion can show lightweight in-app status; failure only attention-worthy if user is waiting in Wizard.

## 22. Search / filtering / sorting / bulk actions
Filter by user/AI tag, source type, rights status; bulk tag/remove with confirmation; multi-select for pattern inspection.

## 23. Analytics and product telemetry
Time to build board, analyze runs, pattern acceptance/edit/reject, duplicate warnings, user-vs-AI tag corrections.

## 24. Learning feedback
Moodboard patterns are Identity evidence/candidates, not performance learnings.

## 25. Auditability / provenance
Source URL, asset origin, rights status history, tag author, analysis run/config, accepted pattern decision.

## 26. Desktop / mobile behavior
Desktop primary canvas/grid. Mobile supports capture/add/reference tagging and review.

## 27. Accessibility / usability
Every image supports descriptive label/alt-like internal note; grid navigable by keyboard; pattern evidence not color-only.

## 28. Security / privacy / rights
Private references remain private. External URLs are not assumed licensed. License proof lives in AssetRights when applicable.

## 29. Performance / async jobs
Uploads/previews/analyze run asynchronously as needed; board usable while analysis runs. Jobs idempotent per board revision/hash.

## 30. Acceptance criteria
1. User can add references and annotate likes/dislikes.
2. AI/user tags are distinct.
3. Analysis shows supporting items.
4. Reference-only asset can stay on board but is not considered publishable.
5. Disliked elements are not silently promoted.
6. Pattern suggestions do not modify Visual DNA until approved.
7. Duplicate references do not falsely inflate pattern frequency without warning/handling.

## 31. Test matrix
Unit: board/item validation, pattern source integrity, rights behavior. Integration: Assets/Storage/Job. Agent/vision eval: recurring pattern extraction + disliked-element handling. E2E: board→analyze→Visual DNA candidate.

## 32. Open questions
Whether remote images should be mirrored or referenced only depends on rights/storage policy; engineering/legal product review required.

## 33. Traceability
`IDN-MOOD-001–018` → MASTER 65–68, 181–185, 349, 404.
