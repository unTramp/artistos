# Artist Brain

- **Status:** REVIEW COMPLETE
- **MASTER references:** §113–115, §123–126
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `artist-brain`
- **Requirement prefix:** `KNW-ART`

## 2. Purpose
Maintain a compact, everyday operating summary of the artist that is useful for strategy and generation without duplicating the full Identity Engine.

## 3. User problem / job-to-be-done
AI and product workflows need a concise artist context. Loading full archetype, moodboard, mystique and history every time is expensive and increases contradiction risk.

## 4. Scope
### In scope
- Identity summary
- story/positioning/values
- tone/audience/content philosophy
- hard rules/anti-patterns
- validated learnings
- version/provenance

### Out of scope / non-goals
- full Identity storage
- free-form dumping ground
- unreviewed automatic permanent memory

## 5. Entry points
- Knowledge
- Context Assembler
- Strategy/Factory
- onboarding

## 6. Preconditions and dependencies
- Artist Identity
- Validated Learnings
- approved artist statements

## 7. Information architecture
System compiles/edits compact summary → user reviews critical fields → Brain becomes HOT context → relevant updates trigger candidate refresh → historical versions/provenance preserved.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER Artist Brain sections. Detailed Identity remains in Identity Engine; Brain references/summary only.

## 10. Main happy-path workflow
1. view/edit approved summary
2. accept candidate update
3. reject candidate
4. open source Identity/Learning

## 11. Alternative workflows
- identity incomplete
- new era
- contradictory learning
- artist intentionally changes positioning

## 12. User actions
- edit
- approve candidate
- revert summary version if supported

## 13. State model
No MASTER state enum; treat permanent changes as reviewed/versioned knowledge.

## 14. Business rules
- `KNW-ART-001` Artist Brain MUST remain a compact operational summary, not duplicate full Identity structures.
- `KNW-ART-002` Detailed archetype/visual DNA/narrative/mystique MUST remain owned by Identity Engine.
- `KNW-ART-003` Validated Learnings may be summarized with scope/freshness and MUST not lose provenance.
- `KNW-ART-004` Hard rules/anti-patterns MUST override stylistic examples in Context Assembler.
- `KNW-ART-005` Unreviewed Candidate Knowledge MUST NOT enter permanent Brain as fact automatically.
- `KNW-ART-006` Brain updates caused by Identity version change SHOULD be traceable to that version.
- `KNW-ART-007` AI MUST not invent biography/values/positioning to fill empty sections.
- `KNW-ART-008` Cold-start Brain may be sparse and MUST prefer “unknown” over generic musician clichés.
- `KNW-ART-009` Brain content SHOULD be exportable/portable.

## 15. AI behavior
AI may propose concise summaries/diffs from approved sources; permanent updates require review.

## 16. Human approval
Human approves material Brain changes.

## 17. Validation
- source references valid
- hard rule conflicts surfaced
- summary version tied to current identity where relevant

## 18. UI states
- sparse
- active
- candidate update
- conflict
- outdated after identity version change

## 19. Edge cases
- identity major reset
- learning deprecated
- artist statement conflicts with old summary

## 20. Cross-module effects
- Identity
- Context Assembler
- Strategy
- Knowledge Export

## 21. Notifications and attention model
- candidate update waiting review
- Brain conflicts with active Identity

## 22. Search / filtering / sorting / bulk actions
Search by section/source. Bulk permanent promotion is discouraged.

## 23. Analytics and product telemetry
- candidate accepted/rejected
- summary changed
- source opened

## 24. Learning feedback
Brain is durable context, not a separate learning engine.

## 25. Auditability / provenance
Version/actor/source links for material edits.

## 26. Desktop / mobile behavior
Desktop editing; mobile read/quick correction.

## 27. Accessibility / usability
Show concise source badges and hard-rule emphasis.

## 28. Security / privacy / rights
May contain private artist context; exports explicit.

## 29. Performance / async jobs
Summary refresh can be async/cached.

## 30. Acceptance criteria
- `KNW-ART-AC01` Full Identity is not duplicated.
- `KNW-ART-AC02` Candidate knowledge cannot auto-enter Brain.
- `KNW-ART-AC03` Unknown stays unknown.
- `KNW-ART-AC04` Hard rules preserve provenance.

## 31. Test matrix
- cold start
- new era
- deprecated learning
- conflicting source

## 32. Open questions
- Brain versioning entity vs generated snapshot needs schema decision.

## 33. Traceability
MASTER §113–115, §123–126
