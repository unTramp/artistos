# Seasonal Opportunities

- **Status:** REVIEW COMPLETE
- **MASTER references:** §154–155, §252–255, §325
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `seasonal-opportunities`
- **Requirement prefix:** `PLN-SEA`

## 2. Purpose
Surface culturally/market-relevant dates and themes as optional planning opportunities while preventing generic holiday spam or culturally inappropriate automation.

## 3. User problem / job-to-be-done
Seasonal events can create natural context for music/content, but blindly posting around every holiday produces irrelevant content and can be culturally insensitive. The artist needs selective, evidence-aware opportunities.

## 4. Scope
MASTER SeasonalOpportunity, market/culture/date/theme/relevance/artistFit/campaignFit; research provenance/freshness; save/dismiss/use workflow; Calendar overlay.

## 5. Entry points
Calendar, Growth/Market, Research, Campaign planning, Factory.

## 6. Preconditions and dependencies
Market/language/culture context recommended. Research claims for date/cultural meaning should have source/freshness appropriate to risk.

## 7. Information architecture
Upcoming opportunities → market/culture filters → opportunity detail → relevance rationale → source/date → use/dismiss/save.

## 8. User roles and permissions
Single artist chooses whether to use. AI/research can surface, never automatically campaign around it.

## 9. Core data model
Uses MASTER SeasonalOpportunity plus source/provenance via ResearchClaim where external knowledge is involved. `artistFit`/`campaignFit` should be explainable dimensions, not magic scalar scores.

## 10. Main happy-path workflow
System/research imports opportunity → evaluates contextual relevance to active markets/artist/campaign → user inspects source and rationale → saves/uses opportunity → creates slot/Angle/Campaign note → normal content workflow continues.

## 11. Alternative workflows
User manually creates local cultural event; date uncertain; market not targeted; event is sensitive/mourning context; opportunity dismissed; recurring annual event requires fresh verification.

## 12. User actions
Save, dismiss with reason, mark irrelevant, create planning slot, open Factory with context, add source/correction, snooze until future period.

## 13. State model
Candidate/Saved/Used/Dismissed/Expired may be projection; MASTER does not define formal status.

## 14. Business rules
- `PLN-SEA-001` Seasonal opportunities MUST be optional; system MUST NOT auto-apply cultural events to all artists or markets.
- `PLN-SEA-002` Opportunity MUST identify market/culture/date/theme.
- `PLN-SEA-003` Relevance rationale MUST distinguish artist fit, campaign fit and market relevance.
- `PLN-SEA-004` Fit MUST NOT be represented solely by an unexplained numeric score.
- `PLN-SEA-005` Date/cultural claims SHOULD include source and freshness/verification where externally derived.
- `PLN-SEA-006` Annual recurring events MUST be revalidated when date/rules vary.
- `PLN-SEA-007` Sensitive commemorative/mourning events MUST NOT be treated as generic engagement opportunities.
- `PLN-SEA-008` AI MUST NOT invent cultural affiliation or assume the artist should participate because a market is targeted.
- `PLN-SEA-009` User dismissal SHOULD reduce repeated resurfacing of the same irrelevant opportunity.
- `PLN-SEA-010` Using an opportunity MUST create normal Content/Campaign planning lineage; opportunity itself does not become content.
- `PLN-SEA-011` Expired opportunities SHOULD remain historically traceable if used.
- `PLN-SEA-012` When market relevance is unknown, system MUST say unknown rather than imply fit.
- `PLN-SEA-013` Seasonal planning MUST remain useful in manual/research-only mode without AI.

## 15. AI behavior
Research Agent may identify current/known events and Strategy Agent may explain possible relevance based on explicit markets, Song/Campaign and Identity. Must avoid stereotypes and unsupported cultural assumptions.

## 16. Human approval
Human always decides participation and creative framing.

## 17. Validation
Date/source valid when authoritative fact needed; market/culture explicit; no auto-publication; stale opportunity flagged.

## 18. UI states
Upcoming; saved; no relevant opportunities; stale/unverified; sensitive-context warning; dismissed; expired.

## 19. Edge cases
Date changes; event differs by country/region; market is multilingual; campaign theme clashes; user intentionally participates outside usual market.

## 20. Cross-module effects
Can create Calendar slot/Factory context; Growth provides market context; Research provides claims; Campaign may link use.

## 21. Notifications and attention model
Only saved/high-relevance user-approved opportunities approaching planning window may create reminder. Auto-discovered opportunities should not spam Overview.

## 22. Search / filtering / sorting / bulk actions
Filter market/date/culture/saved/relevance. Bulk dismiss may be allowed by category/market.

## 23. Analytics and product telemetry
Save/dismiss/use, reason, lead time, suggestion acceptance. Do not interpret performance as proof of cultural causality.

## 24. Learning feedback
Repeated market response may generate hypotheses about seasonal fit, not hard cultural rules.

## 25. Auditability / provenance
Store source, verification date, rationale, user decision and linked resulting work.

## 26. Desktop / mobile behavior
Desktop research/planning; mobile upcoming saved reminders and quick dismiss/use.

## 27. Accessibility / usability
Use neutral wording; disclose why suggested; sensitive warnings text-based.

## 28. Security / privacy / rights
No sensitive identity inference. External research follows claim governance.

## 29. Performance / async jobs
Research refresh may be async; saved opportunity rendering immediate.

## 30. Acceptance criteria
- `PLN-SEA-AC01` Opportunity is market/culture/date-specific.
- `PLN-SEA-AC02` System never auto-participates.
- `PLN-SEA-AC03` Unknown/stale cultural relevance is visible.
- `PLN-SEA-AC04` Sensitive events are not framed as engagement hacks.
- `PLN-SEA-AC05` User can create normal planning work with source lineage.

## 31. Test matrix
Relevant event; irrelevant market; stale date; sensitive event; manual entry; dismissed repeat; AI unavailable.

## 32. Open questions
Formal status enum and whether opportunity discovery belongs primarily to Growth/Research with Calendar only consuming a projection.

## 33. Traceability
MASTER §154–155, §252–255, §325.
