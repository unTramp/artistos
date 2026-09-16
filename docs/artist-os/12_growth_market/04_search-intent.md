# Search Intent & Opportunity

- **Status:** REVIEW COMPLETE
- **MASTER references:** §249–251, §217–222, §325
- **Domain:** 12_growth_market
- **Feature slug:** `search-intent`
- **Requirement prefix:** `GRO-SCH`

## 2. Purpose
Model what audiences may be actively searching for using official/search evidence where available, so content can meet real intent without hidden-keyword hacks.

## 3. User problem / job-to-be-done
Artists hear conflicting SEO advice and often stuff keywords without knowing whether people search for them. The OS should separate genuine search demand/content gaps from speculative tactics.

## 4. Scope
### In scope
- SearchIntent fields
- official search insights/opportunities
- query/demand/content gap/relevance
- content linkage
- research provenance

### Out of scope / non-goals
- hidden off-screen keyword hacks as recommended strategy
- keyword stuffing
- fabricated demand volumes

## 5. Entry points
- Growth home
- Factory
- Platform research
- Market opportunity

## 6. Preconditions and dependencies
- platform official search insights if available
- Content/Song/Artist entities
- ResearchClaim freshness

## 7. Information architecture
Define SearchIntent → import/research opportunities → inspect query/demand/gap/relevance → map to suitable Content Angle → test/measure search-driven response.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `SearchIntent {primaryQuery, secondaryQueries[], entities[], song?, artist, genre, referenceArtists[], topic}`. Search opportunity structure includes query/demand/content gap/relevance when official platform insights exist.

## 10. Main happy-path workflow
1. Create intent for artist/song/topic
2. Import/record official search opportunity
3. Review evidence/freshness
4. Select relevant query only if identity/content fit
5. Send opportunity to Factory as context
6. Measure resulting search/source response

## 11. Alternative workflows
- no official search insight
- brand-name query only
- query irrelevant to identity
- platform hides demand value
- trend is seasonal

## 12. User actions
- create/edit intent
- attach source
- mark irrelevant
- send to Factory
- archive stale opportunity

## 13. State model
Intent can remain active/archived operationally; opportunity freshness/source is more important than status enum.

## 14. Business rules
- `GRO-SCH-001` SearchIntent MUST preserve primary/secondary query semantics from MASTER.
- `GRO-SCH-002` Official platform search insights SHOULD be preferred when available.
- `GRO-SCH-003` Demand values MUST retain source/scale/context and MUST NOT be fabricated.
- `GRO-SCH-004` Off-screen hidden keywords MUST NOT be recommended as core tactic without official evidence.
- `GRO-SCH-005` Keyword relevance MUST consider artist/song/topic fit, not demand alone.
- `GRO-SCH-006` High demand MUST NOT override Identity or audience relevance.
- `GRO-SCH-007` Search opportunity MAY become a Content Angle input but MUST NOT auto-generate/publish content.
- `GRO-SCH-008` Platform-specific search advice MUST carry freshness/source.
- `GRO-SCH-009` No universal keyword density/hashtag rule may be hardcoded.
- `GRO-SCH-010` AI MUST distinguish query evidence from semantic brainstorming.
- `GRO-SCH-011` Historical practitioner hacks may be stored as ResearchClaims but not promoted to fact without evidence.

## 15. AI behavior
Research Agent can collect/summarize current official search insight and Strategy can suggest artist-aligned content opportunities. It must label unknown demand and avoid unsupported hacks.

## 16. Human approval
User approves which search opportunities enter content strategy.

## 17. Validation
- query non-empty
- source/freshness present for claimed demand
- entity references valid

## 18. UI states
- no data
- intent only
- verified opportunity
- stale
- irrelevant
- sent to Factory

## 19. Edge cases
- query changes language
- same phrase ambiguous
- seasonal spike
- platform search insight unavailable

## 20. Cross-module effects
- Factory
- Market Opportunities
- Research Claims
- Audience Sources
- Analytics

## 21. Notifications and attention model
- relevant search opportunity time-sensitive
- source becomes stale

## 22. Search / filtering / sorting / bulk actions
Filter platform/market/language/topic/relevance/freshness. No bulk content generation.

## 23. Analytics and product telemetry
- intent created
- opportunity accepted/rejected
- sent to Factory
- source refreshed

## 24. Learning feedback
Search performance can become a hypothesis/learning after repeated evidence, not from one query spike.

## 25. Auditability / provenance
Preserve query source, date, market/language and mapping to content/experiment.

## 26. Desktop / mobile behavior
Desktop research; mobile opportunity review.

## 27. Accessibility / usability
Display demand scale/source clearly; avoid misleading absolute-looking numbers when platform uses relative scores.

## 28. Security / privacy / rights
No private search/user data should be stored.

## 29. Performance / async jobs
Research/refresh async optional.

## 30. Acceptance criteria
- `GRO-SCH-AC01` Hidden keyword hack is not recommended without official evidence.
- `GRO-SCH-AC02` Demand source/freshness is visible.
- `GRO-SCH-AC03` High demand alone does not force content.
- `GRO-SCH-AC04` Search opportunity can feed Factory with provenance.

## 31. Test matrix
- no official insight
- seasonal query
- ambiguous query
- high-demand poor fit

## 32. Open questions
- Formal SearchOpportunity entity schema/status is not specified in MASTER.

## 33. Traceability
MASTER §249–251, §217–222, §325
