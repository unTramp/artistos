# Tone Corpus

- **Status:** REVIEW COMPLETE
- **MASTER references:** §116–117, §123–126
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `tone-corpus`
- **Requirement prefix:** `KNW-TON`

## 2. Purpose
Preserve real examples of the artist’s language so AI can imitate authentic voice patterns without copying low-quality/outdated text.

## 3. User problem / job-to-be-done
Generic AI copy happens when the model has instructions but no grounded examples. At the same time, blindly retrieving every old caption can copy bad habits.

## 4. Scope
### In scope
- caption/transcript/message/interview/comment examples
- AUTHENTIC/GOOD/NEUTRAL/DO_NOT_COPY/OUTDATED labels
- source/type/language/date
- retrieval examples

### Out of scope / non-goals
- training/fine-tuning in MVP
- automatic copying of exact phrasing

## 5. Entry points
- Knowledge
- Artist Brain
- Factory captions
- Web/Editorial drafting

## 6. Preconditions and dependencies
- approved source texts
- privacy classification
- language

## 7. Information architecture
Ingest/select text → label quality/authenticity/privacy → index → Context Assembler selects diverse relevant examples within budget → anti-copy/anti-AI guard checks output.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Corpus records source text/reference + MASTER label; exact entity schema open.

## 10. Main happy-path workflow
1. add example
2. label
3. exclude
4. open source
5. relabel outdated

## 11. Alternative workflows
- private message useful for tone but not public content
- multilingual tone
- sarcastic one-off style
- old era

## 12. User actions
- label
- archive/exclude
- search
- bulk relabel with review

## 13. State model
Label lifecycle can change; source content remains historical.

## 14. Business rules
- `KNW-TON-001` Tone Corpus labels MUST support AUTHENTIC, GOOD, NEUTRAL, DO_NOT_COPY, OUTDATED.
- `KNW-TON-002` DO_NOT_COPY examples MUST never be selected as positive style examples.
- `KNW-TON-003` OUTDATED examples MAY remain historical but SHOULD be downweighted/excluded from active style retrieval.
- `KNW-TON-004` Private-source examples MUST not be exposed verbatim in public output unless explicitly permitted.
- `KNW-TON-005` Retrieval SHOULD prefer diversity and relevance over repeated near-duplicate captions.
- `KNW-TON-006` AI MUST avoid verbatim memorization/copying of examples beyond necessary short phrases.
- `KNW-TON-007` Tone Corpus MUST not override explicit user request or hard rules.
- `KNW-TON-008` Language/context of examples SHOULD be preserved.
- `KNW-TON-009` Label changes MUST be audited when they materially affect generation.

## 15. AI behavior
AI uses selected examples as style guidance and must not quote private corpus unexpectedly.

## 16. Human approval
User controls labels and inclusion of sensitive examples.

## 17. Validation
- source valid
- label valid
- privacy flag respected

## 18. UI states
- unlabeled
- active positive
- neutral
- do-not-copy
- outdated
- private

## 19. Edge cases
- same caption crossposted
- translated text
- old era
- private DM

## 20. Cross-module effects
- Anti-AI Style
- Context Assembler
- Factory
- Identity

## 21. Notifications and attention model
- positive corpus too sparse
- many examples become outdated after era shift

## 22. Search / filtering / sorting / bulk actions
Filter label/type/language/era/date. Bulk relabel allowed with preview.

## 23. Analytics and product telemetry
- example added
- label changed
- retrieved

## 24. Learning feedback
Corpus quality improves generation but does not become Learning.

## 25. Auditability / provenance
Store source/provenance/privacy/label history.

## 26. Desktop / mobile behavior
Desktop corpus management; mobile quick label.

## 27. Accessibility / usability
Show why example is selected and clear private badge.

## 28. Security / privacy / rights
Messages/interviews may be sensitive; minimize exposure and exports.

## 29. Performance / async jobs
Embedding async; retrieval cached.

## 30. Acceptance criteria
- `KNW-TON-AC01` DO_NOT_COPY never used positively.
- `KNW-TON-AC02` Private example is not surfaced verbatim.
- `KNW-TON-AC03` Outdated examples are downweighted.
- `KNW-TON-AC04` Language/source retained.

## 31. Test matrix
- private DM
- translation
- old era
- duplicates

## 32. Open questions
- Exact verbatim-similarity guard threshold belongs to AI eval/guard implementation.

## 33. Traceability
MASTER §116–117, §123–126
