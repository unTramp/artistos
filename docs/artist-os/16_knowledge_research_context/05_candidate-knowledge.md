# Candidate Knowledge Inbox

- **Status:** REVIEW COMPLETE
- **MASTER references:** §118–119, §20–21, §177
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `candidate-knowledge`
- **Requirement prefix:** `KNW-CAN`

## 2. Purpose
Create a review inbox for statements extracted from voice notes, research, edits or interactions before they become durable knowledge.

## 3. User problem / job-to-be-done
Useful information is constantly discovered, but automatic memory promotion risks polluting the Brain with guesses or transient statements.

## 4. Scope
### In scope
- Candidate Knowledge fields/destinations
- review/accept/reject/edit
- source/confidence
- destination routing
- duplicate/conflict detection

### Out of scope / non-goals
- automatic permanent memory
- hidden learning promotion

## 5. Entry points
- Knowledge inbox
- Voice Note pipeline
- Research extraction
- AI feedback

## 6. Preconditions and dependencies
- sourceId
- destination domains
- existing knowledge

## 7. Information architecture
Source creates candidate → system suggests scope/destination/confidence → Inbox groups duplicates/conflicts → user reviews → accept creates/updates destination through owning workflow or reject → audit retained.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER Candidate Knowledge fields and destinations ARTIST_BRAIN, SONG_BRAIN, IDENTITY, ERA, PLATFORM_KNOWLEDGE, BUSINESS_KNOWLEDGE.

## 10. Main happy-path workflow
1. accept
2. edit then accept
3. reject
4. defer
5. change destination
6. merge duplicates

## 11. Alternative workflows
- candidate contradicts validated learning
- private note
- same statement already exists
- candidate belongs to multiple scopes

## 12. User actions
- accept
- reject
- merge
- change destination
- open source

## 13. State model
Suggested/pending → accepted/rejected/deferred; exact enum not defined.

## 14. Business rules
- `KNW-CAN-001` Candidate Knowledge MUST NOT become permanent knowledge without required human/domain approval.
- `KNW-CAN-002` Candidate destination MUST use MASTER destination vocabulary.
- `KNW-CAN-003` SourceId/provenance MUST be retained.
- `KNW-CAN-004` Confidence is suggestion metadata, not truth probability presented as certainty.
- `KNW-CAN-005` Conflicts with existing knowledge MUST be surfaced before acceptance.
- `KNW-CAN-006` IDENTITY/ERA candidates MUST route through stronger Identity approval/version workflows.
- `KNW-CAN-007` PLATFORM_KNOWLEDGE candidates about rules MUST pass ResearchClaim verification/freshness governance.
- `KNW-CAN-008` Duplicate/near-duplicate candidates SHOULD be grouped rather than create repeated Brain facts.
- `KNW-CAN-009` Rejected candidates SHOULD remain auditable enough to reduce repeated bad suggestions.
- `KNW-CAN-010` AI MUST not promote a candidate merely because it appears repeatedly in generated outputs.

## 15. AI behavior
AI extracts/suggests structured candidates and destination, with source quote/reference. No auto-promotion.

## 16. Human approval
Acceptance/rejection and destination-specific promotion human-controlled.

## 17. Validation
- source exists
- destination valid
- private scope respected

## 18. UI states
- pending
- duplicate
- conflict
- accepted
- rejected
- deferred

## 19. Edge cases
- source deleted
- identity candidate after era change
- research rule stale

## 20. Cross-module effects
- Artist Brain
- Song Brain
- Identity
- Research Claims
- Business Knowledge

## 21. Notifications and attention model
- candidate conflict with hard rule
- inbox backlog

## 22. Search / filtering / sorting / bulk actions
Filter destination/source/confidence/conflict/status. Bulk accept forbidden for sensitive Identity/platform-rule candidates; safe bulk reject possible.

## 23. Analytics and product telemetry
- candidate created
- accepted
- rejected
- destination changed

## 24. Learning feedback
Acceptance may feed durable knowledge; does not bypass learning/research evidence rules.

## 25. Auditability / provenance
Full source/decision audit.

## 26. Desktop / mobile behavior
Desktop inbox; mobile quick review for simple candidates.

## 27. Accessibility / usability
Show source snippet/context and destination consequence.

## 28. Security / privacy / rights
Private voice notes/candidates protected.

## 29. Performance / async jobs
Extraction async; inbox deterministic.

## 30. Acceptance criteria
- `KNW-CAN-AC01` No auto-permanent memory.
- `KNW-CAN-AC02` Identity candidate routes through Identity approval.
- `KNW-CAN-AC03` Platform rule candidate requires research verification.
- `KNW-CAN-AC04` Conflict shown before acceptance.

## 31. Test matrix
- duplicate
- conflict
- private note
- stale research

## 32. Open questions
- Candidate status enum and merge semantics need schema freeze.

## 33. Traceability
MASTER §118–119, §20–21, §177
