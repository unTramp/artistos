# Anti-AI Style Guide

- **Status:** REVIEW COMPLETE
- **MASTER references:** §117, §24–27, §329
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `anti-ai-style`
- **Requirement prefix:** `KNW-AIS`

## 2. Purpose
Codify recurrent generic-AI patterns the artist does not want so generated copy remains specific, restrained and non-repetitive.

## 3. User problem / job-to-be-done
Even with good context, AI drifts into generic inspiration, overdrama, corporate promo or repetitive CTAs. The OS needs explicit negative style memory.

## 4. Scope
### In scope
- generic cliché patterns
- overdrama/corporate promo
- repetitive CTA/rhetorical forms
- recent-caption repetition
- guard checks

### Out of scope / non-goals
- banning creative experimentation
- static global blacklist without artist review

## 5. Entry points
- Knowledge
- Brand Guard
- Factory/Web/Pitch copy

## 6. Preconditions and dependencies
- Artist Brain hard rules
- Tone Corpus
- recent outputs

## 7. Information architecture
Maintain anti-patterns → Guard checks candidate output → explains matched patterns → user can edit/override intentional use → feedback updates candidate style knowledge.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Guide may be structured rules + examples; MASTER defines required categories rather than schema.

## 10. Main happy-path workflow
1. add/edit anti-pattern
2. inspect matched warning
3. override with reason
4. mark false positive

## 11. Alternative workflows
- artist intentionally uses cliché ironically
- song lyric resembles banned phrase
- translation creates generic wording

## 12. User actions
- edit rule
- disable/scope rule
- override warning

## 13. State model
Rules active/inactive/scoped as implementation needs; hard vs preference priority should align IdentityConstraint.

## 14. Business rules
- `KNW-AIS-001` Guide MUST cover generic inspirational clichés, unnecessary overdrama, corporate promo language, repetitive CTA/rhetorical patterns and meaningless recent-caption paraphrase.
- `KNW-AIS-002` Anti-AI rules MUST not override quoted lyrics/factual text without context.
- `KNW-AIS-003` Warnings SHOULD explain the matched pattern, not output opaque quality scores.
- `KNW-AIS-004` Recent-caption similarity SHOULD be checked separately from stable artist signature phrases.
- `KNW-AIS-005` Intentional override MUST be possible and auditable.
- `KNW-AIS-006` False positives SHOULD become guard/eval feedback, not automatic permanent rule deletion.
- `KNW-AIS-007` AI MUST prefer specific grounded detail over generic filler when context exists.
- `KNW-AIS-008` No “humanizer” deception claims should be made; goal is artist-aligned writing.

## 15. AI behavior
Brand Guard applies rules deterministically/LLM-assisted with rationale; it suggests revisions but does not silently mutate approved text.

## 16. Human approval
User can approve override or modify rule.

## 17. Validation
- rule text/scoping valid
- quoted/source content distinguished

## 18. UI states
- clean
- warning
- override
- false positive
- rule disabled

## 19. Edge cases
- lyrics/citations
- irony
- multilingual cliché

## 20. Cross-module effects
- Tone Corpus
- Brand Guard
- AI Evals

## 21. Notifications and attention model
- repeated false positive
- generic output acceptance drops

## 22. Search / filtering / sorting / bulk actions
Filter category/scope/status.

## 23. Analytics and product telemetry
- warning fired
- override
- false positive

## 24. Learning feedback
Feedback improves guard/evals, not artist identity automatically.

## 25. Auditability / provenance
Store rule version/match/output/override.

## 26. Desktop / mobile behavior
Desktop rules; mobile warning review.

## 27. Accessibility / usability
Warnings include textual reason and suggested fix.

## 28. Security / privacy / rights
Private corpus examples not exposed in warning unnecessarily.

## 29. Performance / async jobs
Guard should be fast; can use cheap model/rules with fallback.

## 30. Acceptance criteria
- `KNW-AIS-AC01` Generic cliché warning is explainable.
- `KNW-AIS-AC02` Lyrics are not blindly flagged.
- `KNW-AIS-AC03` Override possible.
- `KNW-AIS-AC04` No silent text rewrite.

## 31. Test matrix
- lyric quote
- irony
- translation
- false positive

## 32. Open questions
- Rule representation and priority integration with IdentityConstraint need engineering alignment.

## 33. Traceability
MASTER §117, §24–27, §329
