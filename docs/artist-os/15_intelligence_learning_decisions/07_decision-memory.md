# Decision Memory

- **Status:** REVIEW COMPLETE
- **MASTER references:** §316–318, §388–390
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `decision-memory`
- **Requirement prefix:** `INT-DMN`

## 2. Purpose
Preserve what the artist/system decided, why, and on what evidence so future strategy can understand intentional choices rather than only outcomes.

## 3. User problem / job-to-be-done
Without decision memory, teams repeatedly revisit old debates or misread historical actions after context is lost.

## 4. Scope
### In scope
- Decision entity/status
- reason/evidence/experiment links
- scope/reviewAt
- reversal/expiry history
- search/retrieval

### Out of scope / non-goals
- automatic irreversible decisions
- replacing raw evidence

## 5. Entry points
- Weekly Review
- Identity Review
- Campaign/Business/Strategy actions

## 6. Preconditions and dependencies
- Insights/Learnings/Experiments
- Audit events

## 7. Information architecture
Create material decision → state decision/reason/scope → link evidence/experiments → set review date if needed → use in future Context/Reviews → reverse/expire with rationale while preserving history.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `Decision {id,title,decision,reason,evidenceIds[],experimentIds[],scope,createdAt,reviewAt?,status}`; status ACTIVE, UNDER_REVIEW, REVERSED, EXPIRED.

## 10. Main happy-path workflow
1. create
2. edit before final if draft mechanism exists
3. set reviewAt
4. mark under review
5. reverse with new rationale
6. expire

## 11. Alternative workflows
- decision made despite weak evidence
- creative exception
- time-bounded campaign decision
- identity decision

## 12. User actions
- create
- review
- reverse
- expire
- open evidence

## 13. State model
ACTIVE ↔ UNDER_REVIEW; ACTIVE/UNDER_REVIEW may become REVERSED or EXPIRED. Historical record preserved.

## 14. Business rules
- `INT-DMN-001` Decision status MUST use MASTER enum.
- `INT-DMN-002` Decision MUST store reason and relevant evidence/experiment links where available.
- `INT-DMN-003` Reversal MUST preserve original decision and add rationale/time rather than overwrite history.
- `INT-DMN-004` Creative exceptions MAY be valid decisions even when optimization evidence points elsewhere.
- `INT-DMN-005` Decision Memory MUST distinguish “we learned X” from “we chose Y”.
- `INT-DMN-006` reviewAt SHOULD surface planned reconsideration without forcing reversal.
- `INT-DMN-007` Expired/reversed decisions MUST remain searchable for historical context.
- `INT-DMN-008` Identity decisions require explicit human approval and stronger evidence context.
- `INT-DMN-009` AI may propose decisions but MUST not autonomously enact material strategy/identity/publish/spend changes.

## 15. AI behavior
AI can draft decision summary from evidence and surface prior decisions during strategy work.

## 16. Human approval
Material decision creation/reversal/identity decisions human-controlled.

## 17. Validation
- reason nonempty
- status transition valid
- linked evidence exists if referenced

## 18. UI states
- active
- under review
- reversed
- expired
- review due

## 19. Edge cases
- evidence later contradicted
- decision intentionally ignored analytics
- duplicate decisions

## 20. Cross-module effects
- Context Assembler
- Weekly Review
- Identity Review
- Audit

## 21. Notifications and attention model
- reviewAt due
- supporting learning becomes stale/contradicted

## 22. Search / filtering / sorting / bulk actions
Search title/scope/status/date/evidence; filter review due.

## 23. Analytics and product telemetry
- decision created
- reviewed
- reversed
- expired

## 24. Learning feedback
Decision outcomes may later inform process learning, but decision itself is memory.

## 25. Auditability / provenance
Full state/reason/evidence history and actor.

## 26. Desktop / mobile behavior
Desktop detailed decision log; mobile read/review action.

## 27. Accessibility / usability
Show reason/evidence adjacent to decision text.

## 28. Security / privacy / rights
May contain sensitive strategy/business/internal canon.

## 29. Performance / async jobs
Review reminders scheduled; otherwise synchronous.

## 30. Acceptance criteria
- `INT-DMN-AC01` Reversal preserves original decision.
- `INT-DMN-AC02` Expired decisions remain searchable.
- `INT-DMN-AC03` Decision differs from Learning.
- `INT-DMN-AC04` Review date can surface attention.

## 31. Test matrix
- creative exception
- contradicted evidence
- time-bounded
- identity decision

## 32. Open questions
- Decision scope enum is not defined by MASTER; align with domains without inventing brittle taxonomy.

## 33. Traceability
MASTER §316–318, §388–390
