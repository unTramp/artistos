# Playlist Research & Risk

- **Status:** REVIEW COMPLETE
- **MASTER references:** §238–241, §28–35, §325
- **Domain:** 11_dsp
- **Feature slug:** `playlist-research`
- **Requirement prefix:** `DSP-PLY`

## 2. Purpose
Track legitimate playlist opportunities and risk signals while preventing unverifiable “playlist hacks” from becoming product truth.

## 3. User problem / job-to-be-done
Independent artists face a mix of editorial/user playlists, submission services and suspicious offers. They need organized research, fit/risk context and evidence—not folklore about how playlists game algorithms.

## 4. Scope
### In scope
- PlaylistOpportunity
- PlaylistRisk
- submission method/source
- genre/audience fit as explainable dimensions
- curator info when known
- research evidence/status

### Out of scope / non-goals
- guaranteed playlist placement
- payola facilitation
- bot/fake-stream optimization
- closed-algorithm hacks as facts

## 5. Entry points
- DSP home
- Song/Release
- Research
- Artist Playlist

## 6. Preconditions and dependencies
- Song/Release metadata
- ResearchClaim/source
- rights/platform terms
- market/audience context

## 7. Information architecture
Research/import playlist → record source/curator/submission method → evaluate fit and risk evidence → user decides ignore/research/submit externally → record outcome/history.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `PlaylistOpportunity {platform, playlistName, playlistUrl, curator?, genreFit, audienceFit, submissionMethod, status, source}` and `PlaylistRisk NORMAL|UNKNOWN|SUSPICIOUS|AVOID`. Fit score format is not defined and should remain explainable dimensions rather than magic number.

## 10. Main happy-path workflow
1. Add/discover opportunity
2. Inspect source and submission method
3. Assess genre/audience relevance with rationale
4. Assess risk with evidence
5. User decides action
6. Record submission/outcome if applicable
7. Update evidence if risk/source changes

## 11. Alternative workflows
- official editorial playlist with no direct submission
- user playlist curator unknown
- paid offer with suspicious guarantee
- playlist removed
- source stale

## 12. User actions
- add/edit
- open source
- set/confirm risk
- mark avoid
- record submission
- record outcome
- link song/release

## 13. State model
Research status and risk are separate. Risk may change as evidence changes; historical risk decisions are preserved.

## 14. Business rules
- `DSP-PLY-001` PlaylistRisk MUST use MASTER enum.
- `DSP-PLY-002` Risk MUST be evidence-explainable; UNKNOWN is preferred over unsupported safety claims.
- `DSP-PLY-003` Claims such as “one song per artist” or “own track must be top 10” MUST remain unverified hypotheses unless credible evidence exists.
- `DSP-PLY-004` OS MUST NOT recommend artificial streams, bots, deceptive playlist manipulation or suspicious services.
- `DSP-PLY-005` Guaranteed placement/stream promises SHOULD raise a risk warning and require evidence review.
- `DSP-PLY-006` GenreFit/AudienceFit MUST be explainable dimensions, not a single opaque magic score.
- `DSP-PLY-007` PlaylistOpportunity MUST retain source and submission method.
- `DSP-PLY-008` Official editorial pitching SHOULD link to EditorialPitch/DSPOpportunity rather than duplicate the workflow.
- `DSP-PLY-009` Suspicious/AVOID status MUST not delete historical research/outcomes.
- `DSP-PLY-010` Outcome/placement MUST not be inferred if not verified.
- `DSP-PLY-011` AI MUST distinguish official platform rules, reputable research and practitioner anecdotes.
- `DSP-PLY-012` One placement/non-placement MUST NOT become a general playlist strategy rule.

## 15. AI behavior
Research Agent can summarize public/source evidence, flag suspicious patterns and draft fit rationale. It cannot promise placement or suggest manipulating streams.

## 16. Human approval
User chooses whether to submit/contact and confirms risk overrides. External payments/submissions are outside autonomous action.

## 17. Validation
- playlist URL/platform coherent
- source captured
- risk rationale exists for non-NORMAL decisive state where possible
- song/release linked for submission

## 18. UI states
- new/unreviewed
- normal
- unknown risk
- suspicious
- avoid
- submitted
- outcome known/unknown
- stale

## 19. Edge cases
- curator identity uncertain
- playlist name duplicates
- playlist changes genre
- paid submission legitimate but no guarantee
- fake screenshots

## 20. Cross-module effects
- Research Claims
- Editorial Pitch
- Song/Release
- Decision Memory
- Analytics

## 21. Notifications and attention model
- active submission source becomes suspicious
- placement claim cannot be verified

## 22. Search / filtering / sorting / bulk actions
Filter platform/risk/status/genre/market/submission method. Sort by relevance/deadline/source quality; no bulk submissions.

## 23. Analytics and product telemetry
- opportunity added
- risk changed
- source opened
- submission/outcome recorded
- avoid decision

## 24. Learning feedback
Playlist outcomes can contribute to evidence after enough observations; suspicious-source decisions can become operational Decision Memory.

## 25. Auditability / provenance
Store source, research date, risk changes, rationale, actor and outcome proof.

## 26. Desktop / mobile behavior
Desktop research table/detail; mobile risk/outcome checks.

## 27. Accessibility / usability
Risk labels include textual explanation and evidence link; avoid fear-based or sensational presentation.

## 28. Security / privacy / rights
Do not store unnecessary curator private data; only public/business contact context when scope supports it. Follow platform terms.

## 29. Performance / async jobs
Research refresh can be async; stale results clearly marked.

## 30. Acceptance criteria
- `DSP-PLY-AC01` Unverified hack is not displayed as platform fact.
- `DSP-PLY-AC02` Guaranteed placement claim triggers risk review.
- `DSP-PLY-AC03` UNKNOWN risk remains valid.
- `DSP-PLY-AC04` Risk change preserves history.
- `DSP-PLY-AC05` No artificial-stream tactic is recommended.

## 31. Test matrix
- official playlist
- unknown curator
- paid submission
- suspicious guarantee
- removed playlist
- stale source

## 32. Open questions
- Future Publicity/Outreach domain may own curator relationship management; v1.3 should keep playlist research operational, not CRM.

## 33. Traceability
MASTER §238–241, §28–35, §325
