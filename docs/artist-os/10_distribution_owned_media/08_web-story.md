# Web Story

- **Status:** REVIEW COMPLETE
- **MASTER references:** §83–85, §94–102, §212, §386
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `web-story`
- **Requirement prefix:** `DST-STY`

## 2. Purpose
Transform approved narrative material into an audience-facing web story while preserving the boundary between internal canon, artist interpretation and intentionally withheld meaning.

## 3. User problem / job-to-be-done
Artists need richer release/era storytelling on owned media, but copying everything from Identity Narrative risks over-explaining songs or exposing private material.

## 4. Scope
### In scope
- selection of narrative fragments
- story sections/assets/quotes/music refs
- Mystique/Interpretation checks
- campaign/song/era context
- audience-facing preview

### Out of scope / non-goals
- new canonical identity source
- automatic disclosure of internal canon
- press release generator
- fabricated quotes

## 5. Entry points
- WebExperience STORY section
- Campaign/Release
- Song Brain
- Identity Narrative

## 6. Preconditions and dependencies
- IdentityNarrative
- NarrativeTrack/Beat
- Song story/meaning
- MystiquePolicy
- InterpretationPolicy
- Assets/Rights

## 7. Information architecture
Select story objective/context → retrieve eligible fragments → system proposes audience-facing arc → user edits/approves → Guard checks disclosure → bind to WebExperience version.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `WebStory` concept: campaign/album/song narrative fragments + assets + BTS + quotes + music refs. Detailed persistence may be structured section content within WebExperience or a first-class entity; open for schema pass.

## 10. Main happy-path workflow
1. Choose song/release/era story context
2. System assembles only audience-eligible source material
3. AI/user builds concise story arc
4. Attach approved media/quotes
5. Mystique/Interpretation Guard highlights over-disclosure
6. User approves final audience-facing version
7. WebExperience references the approved story snapshot

## 11. Alternative workflows
- artist wants direct explanation
- artist wants high mystique/minimal copy
- no Song story exists
- quote is private/unverified
- story spans multiple releases

## 12. User actions
- select fragment
- exclude/protect
- edit audience-facing wording
- attach asset
- preview
- approve
- replace story in a future web version

## 13. State model
Draft → review → approved-for-use snapshot. Source narrative entities retain their own states; story approval never changes internal canon.

## 14. Business rules
- `DST-STY-001` Web Story MUST distinguish source/internal narrative from audience-facing wording.
- `DST-STY-002` ProtectedFacts/forbiddenExplanations MUST NOT be surfaced automatically.
- `DST-STY-003` InterpretationPolicy MUST control whether song meaning is direct, poetic, suggestive or ambiguous.
- `DST-STY-004` AI MUST NOT convert AUDIENCE_INTERPRETATION into artist-stated fact.
- `DST-STY-005` Quotes MUST have a real source/provenance; fabricated social proof is prohibited.
- `DST-STY-006` BTS/private materials require explicit audience-facing approval and valid rights.
- `DST-STY-007` Editing Web Story MUST NOT rewrite Song Brain/Identity Narrative source records unless user separately edits those sources.
- `DST-STY-008` Web Story MAY intentionally leave interpretive space; completeness is not a quality requirement.
- `DST-STY-009` Campaign/era context SHOULD determine which narrative fragments are relevant.
- `DST-STY-010` Every published story SHOULD preserve the source references and policies used at approval time.

## 15. AI behavior
AI assembles candidate story structure from approved context only, labels source/provenance and flags uncertainty. It must output “insufficient approved narrative” rather than fill gaps with invented biography.

## 16. Human approval
Audience-facing story copy requires user approval, especially disclosure of personal/private narrative.

## 17. Validation
- source fragment exists
- disclosure allowed
- quote provenance valid
- asset rights valid
- identity/era version resolvable

## 18. UI states
- no approved story material
- draft
- guard warning
- approved
- source later changed
- rights warning

## 19. Edge cases
- song meaning intentionally secret
- audience theory included as quote/comment
- old era story reused
- private voice note accidentally retrieved
- story copy contradicts current identity

## 20. Cross-module effects
- Identity Narrative
- Song Brain
- Narrative
- Owned Media
- Brand Guard
- Assets/Rights

## 21. Notifications and attention model
- live story source rights expire
- new mystique policy conflicts with future republish
- source becomes contradicted

## 22. Search / filtering / sorting / bulk actions
Filter candidate fragments by source/type/disclosure. No bulk “publish all narrative” action.

## 23. Analytics and product telemetry
- fragment proposed/accepted/rejected
- guard warning/override
- story approved
- source provenance opened

## 24. Learning feedback
Audience response can create Insights about narrative resonance; it must not rewrite Identity Narrative automatically.

## 25. Auditability / provenance
Store source IDs/versions, disclosure policy snapshot, edits, actor and approval time.

## 26. Desktop / mobile behavior
Desktop authoring; mobile review/preview approval.

## 27. Accessibility / usability
Clearly mark private/protected items and source type. Prevent accidental drag/drop of protected content into public section without warning.

## 28. Security / privacy / rights
Internal canon and private story data are sensitive; retrieval/output must minimize exposure and respect export/public mode.

## 29. Performance / async jobs
AI drafting can be async; deterministic manual story composition remains possible.

## 30. Acceptance criteria
- `DST-STY-AC01` Protected fact is excluded from AI story output.
- `DST-STY-AC02` Audience interpretation is not rendered as artist fact.
- `DST-STY-AC03` Approved story keeps source provenance.
- `DST-STY-AC04` Changing web copy does not mutate Song Brain.
- `DST-STY-AC05` No source evidence results in insufficient-material state, not invented biography.

## 31. Test matrix
- high mystique
- direct story
- private source
- audience interpretation
- rights-blocked BTS
- source changed

## 32. Open questions
- Choose first-class WebStory entity vs embedded/versioned WebExperience section during schema design.

## 33. Traceability
MASTER §83–85, §94–102, §212, §386
