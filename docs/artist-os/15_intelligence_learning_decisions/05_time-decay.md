# Learning Time Decay & Freshness

- **Status:** REVIEW COMPLETE
- **MASTER references:** §33, §310–311
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `time-decay`
- **Requirement prefix:** `INT-DEC`

## 2. Purpose
Reduce the influence of old context where appropriate without erasing history, and prompt retesting when platform/audience conditions may have changed.

## 3. User problem / job-to-be-done
A tactic that worked a year ago may still matter artistically but platform behavior can change. The OS needs different freshness behavior by scope.

## 4. Scope
### In scope
- age/freshness metadata
- decay/retest policy by scope
- STALE transition suggestions
- historical preservation

### Out of scope / non-goals
- deleting old evidence
- one global expiration time

## 5. Entry points
- Learning detail
- Weekly Review
- Context Assembler

## 6. Preconditions and dependencies
- Learning state/scope/evidence dates
- ResearchClaim freshness
- platform capability freshness

## 7. Information architecture
Evaluate age + scope + new contradictions → compute freshness/retest recommendation → user reviews material transitions → Context Assembler downweights stale knowledge while preserving history.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Policy layer over Learning/ResearchClaim, not new entity necessarily.

## 10. Main happy-path workflow
1. inspect freshness
2. retest
3. accept stale status
4. keep active with rationale if long-lived

## 11. Alternative workflows
- timeless identity principle
- fast-changing platform tactic
- seasonal market learning
- new contradictory evidence

## 12. User actions
- retest
- mark stale
- reactivate after validation

## 13. State model
VALIDATED may transition to STALE; retest can restore appropriate active/validated state. Evidence remains.

## 14. Business rules
- `INT-DEC-001` Time decay MUST NOT delete historical evidence.
- `INT-DEC-002` Freshness policy SHOULD vary by scope/source rather than one universal TTL.
- `INT-DEC-003` Platform/capability/tactic knowledge SHOULD generally decay faster than stable artist facts/identity values.
- `INT-DEC-004` Age alone MAY trigger review, not automatic falsification.
- `INT-DEC-005` Contradictory recent evidence SHOULD increase retest urgency.
- `INT-DEC-006` STALE Learning MUST be downweighted/flagged in Context Assembler.
- `INT-DEC-007` User may retain a long-lived rule with rationale when scope is inherently stable.
- `INT-DEC-008` AI MUST explain why retest is suggested.

## 15. AI behavior
AI can recommend retest priority from age/scope/contradictions, not silently change core identity.

## 16. Human approval
Material stale/restore transitions reviewed; scheduled system may flag candidates automatically.

## 17. Validation
- timestamps available
- scope known
- policy version known

## 18. UI states
- fresh
- aging
- stale candidate
- stale
- retesting

## 19. Edge cases
- seasonal evidence
- platform redesign
- identity value old but stable

## 20. Cross-module effects
- Context Assembler
- Research Claims
- Weekly Review

## 21. Notifications and attention model
- learning crosses freshness threshold
- new contradiction

## 22. Search / filtering / sorting / bulk actions
Filter freshness/age/scope.

## 23. Analytics and product telemetry
- stale flagged
- retest started
- restored

## 24. Learning feedback
Retesting updates durable Learning evidence.

## 25. Auditability / provenance
Preserve policy/version and transition rationale.

## 26. Desktop / mobile behavior
Desktop review queue; mobile stale alert.

## 27. Accessibility / usability
Explain freshness in dates/reasons, not abstract decay score only.

## 28. Security / privacy / rights
No extra privacy.

## 29. Performance / async jobs
Scheduled staleness job can run periodically.

## 30. Acceptance criteria
- `INT-DEC-AC01` Old evidence remains accessible.
- `INT-DEC-AC02` Platform tactic can stale faster than identity value.
- `INT-DEC-AC03` Age does not mean false.
- `INT-DEC-AC04` Context downweights stale learning.

## 31. Test matrix
- stable identity
- platform tactic
- seasonal
- contradicted

## 32. Open questions
- Per-scope decay curves/thresholds require calibration.

## 33. Traceability
MASTER §33, §310–311
