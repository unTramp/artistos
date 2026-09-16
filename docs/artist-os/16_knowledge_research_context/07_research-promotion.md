# Research Promotion Pipeline

- **Status:** REVIEW COMPLETE
- **MASTER references:** §34–35, §118–126
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `research-promotion`
- **Requirement prefix:** `KNW-RPR`

## 2. Purpose
Define the controlled path from external source to rejected heuristic, test candidate or promoted domain knowledge.

## 3. User problem / job-to-be-done
Without promotion governance, every course tip can leak directly into product recommendations. The OS needs an explicit gate.

## 4. Scope
### In scope
- SOURCE→CLAIM EXTRACTION→VERIFY/CLASSIFY→REJECT/HEURISTIC/CANDIDATE/PROMOTE
- destination rules
- experiment handoff
- audit

### Out of scope / non-goals
- silent auto-promotion
- rewriting MASTER from a single source

## 5. Entry points
- Research Claim detail
- research batch review

## 6. Preconditions and dependencies
- ResearchClaim
- Candidate Knowledge
- domain knowledge
- Experiments

## 7. Information architecture
Select verified/classified claim → choose disposition → REJECT stores reason; HEURISTIC remains advisory; CANDIDATE routes to testing/knowledge inbox; PROMOTE only where authority/domain rules permit → downstream provenance retained.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Pipeline state/disposition may be fields on ResearchClaim or review record; exact schema open.

## 10. Main happy-path workflow
1. reject
2. keep heuristic
3. create candidate
4. create experiment
5. promote allowed domain rule
6. reverse promotion

## 11. Alternative workflows
- primary source hard constraint
- practitioner creative tactic
- contradicted claim
- stale but historically useful

## 12. User actions
- choose disposition
- record rationale
- open destination

## 13. State model
Disposition is separate from verification status.

## 14. Business rules
- `KNW-RPR-001` Promotion disposition MUST distinguish REJECT, HEURISTIC, CANDIDATE and PROMOTE.
- `KNW-RPR-002` Verification status and promotion disposition MUST remain separate concepts.
- `KNW-RPR-003` PRIMARY_SOURCE_VERIFIED may support PROMOTE for authoritative operational constraints but does not automatically require it.
- `KNW-RPR-004` C_PRACTITIONER/D_ANECDOTAL tactics SHOULD default to HEURISTIC/CANDIDATE rather than platform truth.
- `KNW-RPR-005` Creative tactic candidates SHOULD usually route to Experiment rather than hard rule.
- `KNW-RPR-006` Contradicted claims MUST NOT be promoted as current knowledge.
- `KNW-RPR-007` Promotion MUST preserve source/provenance/freshness.
- `KNW-RPR-008` Reversal/deprecation MUST preserve historical rationale.
- `KNW-RPR-009` AI may recommend disposition but MUST not rewrite frozen MASTER architecture automatically.

## 15. AI behavior
Research Agent proposes disposition and application with rationale; human/domain governance decides promotion.

## 16. Human approval
PROMOTE and architecture-affecting decisions require explicit human approval.

## 17. Validation
- claim classified
- verification adequate for chosen disposition
- destination supports claim type

## 18. UI states
- awaiting disposition
- rejected
- heuristic
- candidate
- promoted
- reversed

## 19. Edge cases
- primary source later changes
- heuristic succeeds for artist
- multiple practitioner sources disagree

## 20. Cross-module effects
- Research Claims
- Experiments
- Candidate Knowledge
- Capability Registry

## 21. Notifications and attention model
- promoted claim becomes stale/contradicted

## 22. Search / filtering / sorting / bulk actions
Filter disposition/status/domain/platform.

## 23. Analytics and product telemetry
- disposition chosen
- promotion reversed
- experiment created

## 24. Learning feedback
Candidate results can later become own-data Learning via normal experiment loop.

## 25. Auditability / provenance
Record reviewer/rationale/source/destination.

## 26. Desktop / mobile behavior
Desktop review; mobile simple disposition review.

## 27. Accessibility / usability
Explain difference between “verified source fact” and “works for this artist”.

## 28. Security / privacy / rights
No additional privacy.

## 29. Performance / async jobs
Research batch extraction async; promotion synchronous.

## 30. Acceptance criteria
- `KNW-RPR-AC01` Practitioner advice defaults away from platform truth.
- `KNW-RPR-AC02` Disposition is separate from verification.
- `KNW-RPR-AC03` Contradicted claim cannot promote.
- `KNW-RPR-AC04` Promotion provenance preserved.

## 31. Test matrix
- hard constraint
- creative heuristic
- contradicted
- stale promoted

## 32. Open questions
- Exact authorization/reviewer roles future-ready but single artist MVP sufficient.

## 33. Traceability
MASTER §34–35, §118–126
