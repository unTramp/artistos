# Identity Review

- **Status:** REVIEW COMPLETE
- **MASTER references:** §314–315, §321, §53–92
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `identity-review`
- **Requirement prefix:** `INT-IDR`

## 2. Purpose
Review whether accumulated repeated evidence justifies era evolution or identity refinement on a slower cadence than tactical optimization.

## 3. User problem / job-to-be-done
If identity reacts to weekly engagement, the artist becomes inconsistent and optimization-driven. Identity review needs a higher evidence threshold and explicit human authorship.

## 4. Scope
### In scope
- monthly/quarterly/event-driven review
- identity hypothesis evidence
- repeated tests/contradictions
- Era evolution vs Identity update vs no change
- decision record

### Out of scope / non-goals
- weekly automatic rebrand
- engagement-only archetype changes

## 5. Entry points
- Identity dashboard
- stale/validated IDENTITY learning
- event-driven major change

## 6. Preconditions and dependencies
- Identity Versions
- IDENTITY scoped Insights/Hypotheses/Learnings
- Decisions
- Era

## 7. Information architecture
Trigger review on cadence/event → assemble identity evidence over longer window → separate tactical noise from repeated pattern → inspect artist intent → choose no change / Era evolution / draft identity update → create Decision and new version workflow only after approval.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Review artifact may be separate or part of Identity versioning workflow; MASTER defines cadence principle, not entity.

## 10. Main happy-path workflow
1. start review
2. inspect identity hypotheses
3. dismiss weak signal
4. create Era evolution
5. start new Identity Version
6. record no-change decision

## 11. Alternative workflows
- artist chooses change without performance evidence
- strong engagement conflicts with artistic intent
- new life/creative event drives era

## 12. User actions
- review
- defer
- no change
- create era
- draft new version

## 13. State model
Not a weekly state machine; explicit review session/history recommended.

## 14. Business rules
- `INT-IDR-001` Identity Review MUST occur less frequently than weekly tactical review by default (monthly/quarterly/event-driven).
- `INT-IDR-002` Identity changes require stronger evidence and human approval than tactical learnings.
- `INT-IDR-003` Performance signal MUST pass through Insight → Identity Hypothesis → repeated tests/evidence before evidence-driven identity update.
- `INT-IDR-004` Artist intent MAY justify no change despite performance evidence.
- `INT-IDR-005` Artist intent MAY justify creative evolution even without optimization evidence, recorded as deliberate decision.
- `INT-IDR-006` No algorithm/agent may automatically change archetype, protected narrative or non-negotiable constraints.
- `INT-IDR-007` Era evolution SHOULD be considered before major Identity rewrite when change is contextual/temporary.
- `INT-IDR-008` Contradictory evidence MUST be visible.
- `INT-IDR-009` No-change outcome is a valid review result and SHOULD be recordable.
- `INT-IDR-010` Historical Identity versions/decisions remain preserved.

## 15. AI behavior
AI can summarize long-horizon evidence and articulate competing interpretations; it cannot recommend engagement-maximizing rebrand as objective truth or apply changes.

## 16. Human approval
Artist explicitly approves any Era/Identity change.

## 17. Validation
- review window sufficient/context explicit
- identity evidence scoped
- current version known

## 18. UI states
- not due
- due
- in review
- no change
- era evolution
- identity draft

## 19. Edge cases
- major life event
- viral outlier
- new genre experiment
- contradictory audience response

## 20. Cross-module effects
- Identity Versioning
- Era
- Learning
- Decision Memory

## 21. Notifications and attention model
- identity review due
- validated identity learning/contradiction accumulates

## 22. Search / filtering / sorting / bulk actions
Review history filter by date/outcome/version.

## 23. Analytics and product telemetry
- review started
- signal dismissed
- no-change decision
- era/new-version created

## 24. Learning feedback
Identity review is the controlled promotion path from performance evidence to artist identity evolution.

## 25. Auditability / provenance
Preserve evidence window, artist rationale, outcome and version links.

## 26. Desktop / mobile behavior
Desktop deep review; mobile read-only/decision summary.

## 27. Accessibility / usability
Prioritize artist language and intent over dashboard scoring.

## 28. Security / privacy / rights
Identity/private narrative may be sensitive; no public exposure.

## 29. Performance / async jobs
Context synthesis async optional; no automatic changes.

## 30. Acceptance criteria
- `INT-IDR-AC01` Weekly metrics cannot auto-change Identity.
- `INT-IDR-AC02` No-change is valid.
- `INT-IDR-AC03` Artist can reject optimization-driven change.
- `INT-IDR-AC04` Approved evolution creates version/era workflow with history.

## 31. Test matrix
- viral outlier
- creative life event
- contradictory evidence
- no change

## 32. Open questions
- Default cadence configurable; event-driven criteria should remain suggestions rather than hardcoded triggers.

## 33. Traceability
MASTER §314–315, §321, §53–92
