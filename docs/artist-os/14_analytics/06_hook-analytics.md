# Hook Analytics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §134–137, §297, §301–315
- **Domain:** 14_analytics
- **Feature slug:** `hook-analytics`
- **Requirement prefix:** `ANA-HOK`

## 2. Purpose
Compare hook patterns and emotional mechanisms within appropriate platform/audience context to learn what opening strategies merit retesting.

## 3. User problem / job-to-be-done
Hooks are easy to overgeneralize from one successful video. The OS needs execution-level metadata, comparable samples and experiment context.

## 4. Scope
### In scope
- hook pattern
- emotional mechanism
- spoken/text/visual/audio hook dimensions
- platform/audience scope
- performance distributions
- experiment links

### Out of scope / non-goals
- universal best hook
- causal claim from observational data

## 5. Entry points
- Analytics specialized tab
- Content Unit/HookVariant
- Experiment

## 6. Preconditions and dependencies
- HookVariant metadata
- Publication metrics
- platform/audience scope

## 7. Information architecture
Select platform/period → group executions by hook pattern/mechanism → show sample/median/outliers → inspect controlled experiments separately → create scoped Insight/Hypothesis.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Analytical projection over HookVariant + Publications; no independent hook-score entity.

## 10. Main happy-path workflow
1. filter hook taxonomy
2. compare patterns
3. open example executions
4. separate experiment-backed evidence
5. create Insight

## 11. Alternative workflows
- hook metadata missing
- same concept changes multiple variables
- small sample
- song segment confounds hook

## 12. User actions
- filter/group
- tag metadata correction
- open experiment
- create hypothesis

## 13. State model
No lifecycle.

## 14. Business rules
- `ANA-HOK-001` Hook comparisons MUST include platform and relevant audience/context scope.
- `ANA-HOK-002` Sample size and median MUST be visible.
- `ANA-HOK-003` Observational hook performance MUST NOT be labelled causal.
- `ANA-HOK-004` Controlled A/B/C variants SHOULD be analyzed separately when only hook variable differs.
- `ANA-HOK-005` Multi-factor variants MUST be marked as such.
- `ANA-HOK-006` Emotional mechanism and hook pattern SHOULD remain distinct dimensions.
- `ANA-HOK-007` One high outlier MUST NOT define “best hook”.
- `ANA-HOK-008` Missing hook metadata MUST reduce coverage rather than be guessed silently.
- `ANA-HOK-009` AI MUST phrase conclusions narrowly and propose retests.

## 15. AI behavior
Analytics Agent summarizes structured groups/experiments and highlights confounds.

## 16. Human approval
Metadata correction and Insight/Learning promotion reviewed by user.

## 17. Validation
- hook metadata valid
- platform same for direct comparison
- sample shown

## 18. UI states
- no metadata
- small sample
- observational
- experiment-backed
- outlier-heavy

## 19. Edge cases
- hook and segment both changed
- caption changed
- paid boost

## 20. Cross-module effects
- Content Factory
- Experiments
- Insights

## 21. Notifications and attention model
- high-performing hook evidence ready for retest

## 22. Search / filtering / sorting / bulk actions
Filter hookPattern/emotionalMechanism/platform/song/campaign/period.

## 23. Analytics and product telemetry
- comparison viewed
- hypothesis created

## 24. Learning feedback
Feeds scoped tactical Learning only after validation.

## 25. Auditability / provenance
Preserve exact HookVariant/experiment references.

## 26. Desktop / mobile behavior
Desktop comparative table/charts; mobile summary.

## 27. Accessibility / usability
Show example hooks without losing context.

## 28. Security / privacy / rights
No extra privacy.

## 29. Performance / async jobs
Aggregation async/cache optional.

## 30. Acceptance criteria
- `ANA-HOK-AC01` Observational result is not causal.
- `ANA-HOK-AC02` A/B/C experiment is identifiable separately.
- `ANA-HOK-AC03` Outlier does not auto-win.
- `ANA-HOK-AC04` Missing metadata is not guessed.

## 31. Test matrix
- small sample
- multi-factor variant
- paid boost
- segment confound

## 32. Open questions
- Audience scope definition depends on available aggregate data.

## 33. Traceability
MASTER §134–137, §297, §301–315
