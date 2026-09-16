# Warm Network Activation

- **Status:** REVIEW COMPLETE
- **MASTER references:** §246–247, §20, §271
- **Domain:** 12_growth_market
- **Feature slug:** `warm-network`
- **Requirement prefix:** `GRO-WRM`

## 2. Purpose
Help the artist deliberately activate relevant existing relationships before or alongside cold acquisition, without mass-messaging everyone or turning contacts into a hidden CRM.

## 3. User problem / job-to-be-done
Independent artists often overlook supporters and professional contacts, but indiscriminate outreach can damage trust. The OS needs a light planning layer for who/why/how to ask, not a spam engine.

## 4. Scope
### In scope
- MASTER warm-network segments
- activation plan by segment
- message/ask intent
- manual completion tracking
- aggregated outcomes

### Out of scope / non-goals
- full contact CRM
- mass DM automation
- scraping private contacts
- coercive social pressure

## 5. Entry points
- Growth home
- Campaign launch plan
- Release activation

## 6. Preconditions and dependencies
- Campaign objective
- audience/privacy scope
- existing manually known segments
- Tone/Identity

## 7. Information architecture
Choose campaign/ask → select relevant segments → define value/context → draft optional message → user chooses recipients externally → record aggregate/manual outcome.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Segment vocabulary: CLOSE_SUPPORTERS, FRIENDS, PROFESSIONAL_NETWORK, MUSIC_CONTACTS, LOCAL_COMMUNITY, PAST_FANS. v1.3 need not persist person-level contacts.

## 10. Main happy-path workflow
1. Open warm-network plan
2. Choose objective and relevant segments
3. System suggests segment-specific approach
4. User edits/approves messaging
5. User reaches out manually/through approved future integration
6. Record aggregate completion/response notes

## 11. Alternative workflows
- artist chooses no outreach
- only professional network relevant
- local community language differs
- past fans data unavailable

## 12. User actions
- select segment
- mark not applicable
- draft/edit ask
- record completed outreach count manually
- record qualitative note

## 13. State model
Plan state may be draft/active/done operationally; individual person state is intentionally out of scope.

## 14. Business rules
- `GRO-WRM-001` OS MUST NOT require contacting 100% of acquaintances.
- `GRO-WRM-002` Warm-network segments MUST use the MASTER vocabulary when categorized.
- `GRO-WRM-003` Person-level tracking MUST NOT be introduced by default under v1.3.
- `GRO-WRM-004` Outreach suggestions MUST respect relationship context and avoid deceptive urgency/manipulation.
- `GRO-WRM-005` AI MUST NOT fabricate familiarity, past support or personal facts about recipients.
- `GRO-WRM-006` Mass automated DM/email sending is out of scope.
- `GRO-WRM-007` Campaign ask SHOULD be explicit about what support is requested and why.
- `GRO-WRM-008` Segment response MUST not be generalized to wider audience behavior without evidence.
- `GRO-WRM-009` No segment is mandatory for every campaign.
- `GRO-WRM-010` Aggregate outcome may feed growth evidence but not hidden fan scoring.

## 15. AI behavior
AI may draft respectful segment-specific messages from campaign context and Tone Corpus, but cannot invent relationship details or send them.

## 16. Human approval
User chooses whether, whom and how to contact; all messages remain manual unless future explicit outreach scope exists.

## 17. Validation
- segment valid
- campaign ask clear
- no invented recipient data
- privacy scope respected

## 18. UI states
- no plan
- draft
- active/manual outreach
- completed
- not applicable

## 19. Edge cases
- recipient relationship sensitive
- campaign already over-messaged network
- message translated
- no response data

## 20. Cross-module effects
- Campaign
- Launch Activation
- Growth Analytics
- Future Publicity/Outreach boundary

## 21. Notifications and attention model
- warm-network task due near launch
- high outreach fatigue noted manually

## 22. Search / filtering / sorting / bulk actions
Filter by segment/campaign/status. No person-level search in v1.3.

## 23. Analytics and product telemetry
- segment selected
- message draft accepted
- outreach marked complete
- aggregate response noted

## 24. Learning feedback
Aggregate outcomes can inform future campaign hypotheses; relationship-specific information is not used to profile individuals.

## 25. Auditability / provenance
Record campaign/segment/ask/message version and aggregate manual outcome, not unnecessary personal conversations.

## 26. Desktop / mobile behavior
Desktop planning; mobile message copy/checklist.

## 27. Accessibility / usability
Clear non-spam framing and easy “not applicable” path.

## 28. Security / privacy / rights
PII minimization is fundamental. Do not import address books/contact lists in this scope.

## 29. Performance / async jobs
No async dependency required except optional AI draft.

## 30. Acceptance criteria
- `GRO-WRM-AC01` No workflow asks user to message everyone.
- `GRO-WRM-AC02` No person-level CRM is created.
- `GRO-WRM-AC03` AI cannot invent relationship context.
- `GRO-WRM-AC04` Any segment can be N/A.
- `GRO-WRM-AC05` Outreach remains human-controlled.

## 31. Test matrix
- no outreach
- professional-only
- local-community
- fatigue
- manual outcome

## 32. Open questions
- If future Publicity/Outreach Engine adds Contact entities, ownership boundary must be reconciled rather than duplicated.

## 33. Traceability
MASTER §246–247, §20, §271
