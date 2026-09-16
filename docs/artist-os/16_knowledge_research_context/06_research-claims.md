# Research Claims Governance

- **Status:** REVIEW COMPLETE
- **MASTER references:** §28–35, §217–222
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `research-claims`
- **Requirement prefix:** `KNW-RCL`

## 2. Purpose
Represent external claims with source, authority, verification and freshness so practitioner advice, platform rules and anecdotes never collapse into one truth layer.

## 3. User problem / job-to-be-done
Artist growth education contains outdated UI walkthroughs and folklore. The system needs epistemic metadata before external advice can influence decisions.

## 4. Scope
### In scope
- ResearchClaim fields
- claim types
- authority
- verification status
- platform/jurisdiction/account scope
- freshness/supersession

### Out of scope / non-goals
- web clipping without evaluation
- automatic promotion of practitioner advice

## 5. Entry points
- Research Agent
- Platform Capability
- Knowledge
- research import

## 6. Preconditions and dependencies
- Source records
- verification evidence

## 7. Information architecture
Capture source → extract claim → classify type/authority/scope → verify/cross-check → set freshness → use as heuristic/candidate/promoted domain knowledge → supersede/contradict with history.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER ResearchClaim + claimType/verification/authority enums.

## 10. Main happy-path workflow
1. create/extract claim
2. verify
3. cross-check
4. mark stale/contradicted
5. supersede
6. promote via pipeline

## 11. Alternative workflows
- official docs ambiguous
- practitioner tactic useful but unverified
- different country rules
- platform docs changed

## 12. User actions
- classify
- verify
- link source
- supersede
- promote/reject

## 13. State model
Verification uses UNVERIFIED, SOURCE_ONLY, CROSS_CHECKED, PRIMARY_SOURCE_VERIFIED, STALE, CONTRADICTED.

## 14. Business rules
- `KNW-RCL-001` Knowledge Claim Type MUST use FACT, ARTIST_STATEMENT, OBSERVATION, HYPOTHESIS, EXTERNAL_HEURISTIC, VALIDATED_LEARNING where applicable.
- `KNW-RCL-002` ResearchClaim verification status MUST use MASTER enum.
- `KNW-RCL-003` Authority MUST use A_PRIMARY, B_REPUTABLE, C_PRACTITIONER, D_ANECDOTAL.
- `KNW-RCL-004` Practitioner advice MUST NOT automatically become a platform rule.
- `KNW-RCL-005` Platform/API/eligibility/monetization/legal-ish operational claims SHOULD prefer official primary sources.
- `KNW-RCL-006` Platform/account/region/jurisdiction scope MUST be recorded when relevant.
- `KNW-RCL-007` validAsOf/freshUntil MUST be used where rule freshness matters.
- `KNW-RCL-008` STALE/CONTRADICTED claims MUST not be presented as current fact in UI/context.
- `KNW-RCL-009` Superseded claims MUST remain historical and link replacement.
- `KNW-RCL-010` AI MUST distinguish source statement from independent verification.
- `KNW-RCL-011` Multiple sources do not increase authority automatically if they copy the same original claim.
- `KNW-RCL-012` Closed-algorithm claims without credible evidence MUST remain hypothesis/heuristic.

## 15. AI behavior
Research Agent outputs Finding/Evidence/Source/Date/Authority/Confidence/Application and proposes claim metadata; verification status changes require evidence.

## 16. Human approval
Promotion into durable platform/business knowledge is reviewed according to domain rules.

## 17. Validation
- sourceId valid
- authority/status enums valid
- scope/freshness coherent

## 18. UI states
- unverified
- source-only
- cross-checked
- primary verified
- stale
- contradicted
- superseded

## 19. Edge cases
- official docs conflict by region
- mirror articles
- deleted page
- UI-only tutorial ages out

## 20. Cross-module effects
- Capability Registry
- Research Promotion
- Context Assembler

## 21. Notifications and attention model
- freshness expiry
- contradiction with primary source

## 22. Search / filtering / sorting / bulk actions
Filter platform/authority/status/freshness/source/date.

## 23. Analytics and product telemetry
- claim extracted
- verified
- staled
- contradicted
- superseded
- promoted

## 24. Learning feedback
External claims can seed experiments; they do not become own-data Learning by repetition alone.

## 25. Auditability / provenance
Full source/version/verification trail.

## 26. Desktop / mobile behavior
Desktop research table/detail; mobile read/status.

## 27. Accessibility / usability
Display authority/status/date prominently.

## 28. Security / privacy / rights
Sources may contain sensitive/private uploads; access controlled.

## 29. Performance / async jobs
Research verification/refresh async.

## 30. Acceptance criteria
- `KNW-RCL-AC01` Practitioner tactic cannot appear as primary platform fact.
- `KNW-RCL-AC02` Stale claim is not current fact.
- `KNW-RCL-AC03` Regional scope retained.
- `KNW-RCL-AC04` Superseded history preserved.

## 31. Test matrix
- regional conflict
- deleted source
- copied secondary
- stale UI tutorial

## 32. Open questions
- Source entity schema/archival snapshot policy needs Research implementation design.

## 33. Traceability
MASTER §28–35, §217–222
