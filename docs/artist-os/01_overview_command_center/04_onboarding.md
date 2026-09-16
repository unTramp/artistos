# System Onboarding & Empty State Journey

## 1. Metadata

- **Spec ID:** `OVR-ONB`
- **Domain:** `01_overview_command_center`
- **Feature:** System Onboarding & Empty State Journey
- **Status:** REVIEW
- **Owner:** Product / Artist OS Core
- **MASTER references:** 16–24, 48, 53–92, 113–126, 192–196, 339–347, 357, 366, 368, 370, 403–411, 449–457
- **Depends on:** Artist creation, Identity MVP, Song creation, production capability, profile readiness, integrations/imports
- **Used by:** first-use experience, empty states across all domains

### 1.1 Normative basis and product derivation

MASTER v1.3 requires useful empty states, single-artist-first architecture, cold-start behavior and an Identity-first product philosophy, but it does not prescribe a single mandatory onboarding wizard. This specification defines the minimum onboarding journey as a product-level elaboration.

The journey must preserve Artist First / Identity Before Optimization and must not force the user to configure every module before receiving value.

---

## 2. Purpose

Turn an empty Artist OS instance into a minimally useful operating system with enough artist context to support meaningful work, while avoiding a long setup wall.

Onboarding should establish:

- who the artist is;
- what the user wants to work on now;
- enough Identity context to avoid generic output;
- at least one useful work object (e.g. Song or identity-building objective);
- optional production/platform context when relevant;
- a clear next action.

---

## 3. User problem / job-to-be-done

**JTBD:** “I have just opened Artist OS. Help me get to a useful first result without making me understand the whole system or fill in dozens of fields.”

---

## 4. Scope

### In scope

- first artist setup;
- goal/focus selection;
- progressive Identity setup entry;
- Song/release entry when applicable;
- optional production capability basics;
- data/import/integration deferral;
- onboarding checklist/progress;
- empty-state actions across core modules;
- resume/skip behavior;
- cold-start communication.

### Out of scope

- completing the entire Identity Wizard inside onboarding;
- requiring all integrations;
- requiring historical analytics import;
- forcing a release campaign;
- team/org setup;
- billing/SaaS onboarding;
- advertising/publicity onboarding.

---

## 5. Entry points

- first launch when no Artist exists;
- `/` when Artist exists but setup is incomplete;
- Settings → Resume setup;
- empty states in Identity/Songs/Factory/Assets/etc. may deep link to relevant setup step.

---

## 6. Preconditions and dependencies

No precondition beyond authenticated application access for first launch.

Onboarding must work with:

- no integrations;
- no analytics;
- no files;
- no AI provider temporarily available (with manual/basic fallback where possible).

---

## 7. Information architecture

### 7.1 Recommended onboarding phases

```text
Welcome
↓
Artist Basics
↓
What are you working on now?
↓
Identity Minimum Context
↓
Song / Release / Identity-building branch
↓
Optional Production Basics
↓
Optional Imports / Platforms
↓
First Useful Action
↓
Overview
```

### 7.2 “Minimum Context” is not “Identity Complete”

Identity is a deep first-class domain. Onboarding should collect only enough information to avoid a generic blank system and then route the user into the real Identity workflow.

Minimum context may include:

- artist name;
- short story/positioning draft;
- values / descriptors;
- languages / genre context;
- current goal;
- optional reference to existing materials.

Archetype, Listening Session, Moodboard, Visual DNA, Narrative, Anchors, Mystique, Typography and Brand Book remain dedicated Identity workflows.

### 7.3 Goal branches

Suggested first intent choices are product navigation aids, not permanent strategy labels:

```text
DEFINE_IDENTITY
PLAN_RELEASE
CREATE_CONTENT
ORGANIZE_ASSETS
UNDERSTAND_PERFORMANCE
SET_UP_PROFILE_DSP
OTHER
```

The system may use them to route the first next action.

---

## 8. User roles and permissions

Single artist/operator MVP. Onboarding creates/configures only the current Artist scope.

---

## 9. Core data model

Onboarding should avoid a large permanent `Onboarding` domain entity unless implementation needs one. A lightweight progress record is acceptable:

```text
OnboardingProgress
artistId
startedAt
completedAt?
currentStep?
completedSteps[]
skippedOptionalSteps[]
initialIntent?
lastSeenAt
```

Actual artist facts belong to their real source entities (`Artist`, `ArtistIdentity`, `Song`, `ProductionCapabilityProfile`, etc.).

---

## 10. Main happy-path workflow

1. User opens Artist OS with no Artist.
2. System explains the OS in one concise value statement and creates/collects Artist Basics.
3. User chooses what they are working on now.
4. System requests minimum identity context and clearly labels it as a starting point, not final identity.
5. User chooses/adds a Song if current intent needs one, or continues identity-building without a Song.
6. System optionally asks for production basics only if relevant to the selected intent.
7. Integrations/imports are offered as optional accelerators, not blockers.
8. System creates a first actionable destination:
   - Identity Discovery,
   - Song Brain setup,
   - Content Factory input setup,
   - Assets import,
   - Profile/DSP readiness,
   - Analytics import.
9. User lands on Overview with Current Focus and a small setup/next-action card.
10. Remaining setup becomes progressive, contextual empty-state work rather than one giant wizard.

---

## 11. Alternative workflows

### Existing artist with historical content

User may start by importing/adding songs/assets/metrics, but Identity setup remains recommended before AI strategy output is treated as personalized.

### Artist wants only Identity first

No Song is required. Overview operates in `IDENTITY_BUILDING` context.

### Artist wants Content immediately

System can allow Content Factory exploration with a visible `Limited personalization`/cold-start qualifier if Identity is incomplete.

### AI unavailable

Collect structured basics manually and defer AI-assisted discovery/analysis.

### User skips most optional setup

Allow entry into OS. Empty states continue to guide missing context when it becomes relevant.

---

## 12. User actions

- create/edit Artist Basics;
- choose/change initial intent;
- continue to Identity;
- add Song;
- skip optional production setup;
- skip integrations/imports;
- resume later;
- exit to Overview;
- restart only non-destructively (do not delete domain data).

---

## 13. State model

Suggested onboarding presentation lifecycle:

```text
NOT_STARTED → IN_PROGRESS → MINIMUM_READY → COMPLETED
                     ↘ PAUSED
PAUSED → IN_PROGRESS
```

`MINIMUM_READY` means the user can operate core product workflows; it does not mean every readiness domain is ready.

Do not confuse onboarding status with `ProfileReadiness` statuses from Distribution.

---

## 14. Business rules

- **OVR-ONB-001** — Onboarding MUST be progressive and MUST NOT require configuration of every Artist OS domain before the user enters the product.
- **OVR-ONB-002** — Artist creation/basic identity context MUST precede personalized AI strategy claims.
- **OVR-ONB-003** — In cold-start state, the system MUST disclose that recommendations rely more on Identity/Song/external current knowledge and less on own validated evidence.
- **OVR-ONB-004** — The user MUST be able to pursue an Identity-building workflow without creating a Song or Release.
- **OVR-ONB-005** — The user MUST be able to add a Song without completing the full Identity Wizard.
- **OVR-ONB-006** — Optional integrations and historical analytics import MUST NOT block core product access.
- **OVR-ONB-007** — Empty states MUST show a contextually useful next action rather than a blank container or fake zero state.
- **OVR-ONB-008** — Empty-state guidance MUST route data entry to the authoritative source domain.
- **OVR-ONB-009** — Onboarding MUST NOT imply that archetype/visual identity or AI-generated suggestions are objective psychological truth.
- **OVR-ONB-010** — AI-generated identity candidates MUST remain candidates until human confirmation under Identity rules.
- **OVR-ONB-011** — Onboarding MUST NOT auto-publish, connect paid spend, auto-rebrand or promote permanent knowledge.
- **OVR-ONB-012** — User-entered real artist materials (songs, story, voice, photos, performances) SHOULD be preferred over generic generated material where available.
- **OVR-ONB-013** — Skipping an optional step MUST NOT mark its source domain as completed/ready.
- **OVR-ONB-014** — Completion of onboarding MUST mean the user reached a minimally useful OS state, not that all readiness checks are green.
- **OVR-ONB-015** — Re-entering onboarding MUST preserve existing domain data and never reset/delete it implicitly.
- **OVR-ONB-016** — Initial intent MAY influence navigation/current focus but MUST remain editable and MUST NOT become a permanent hidden optimization target.
- **OVR-ONB-017** — AI unavailability MUST not prevent Artist Basics and non-AI setup flows.
- **OVR-ONB-018** — Any inferred/suggested field SHOULD support Accept/Edit rather than forcing manual re-entry, consistent with low-friction principle.
- **OVR-ONB-019** — If a field is not needed for the user’s current path, onboarding SHOULD defer it rather than collect it “just in case.”
- **OVR-ONB-020** — No empty state may display unavailable metrics as numeric zero.
- **OVR-ONB-021** — The first-use flow MUST be usable on desktop and responsive mobile, but deep strategy/Identity work may explicitly recommend desktop.
- **OVR-ONB-022** — Setup state and source-domain readiness MUST remain semantically separate.

---

## 15. AI behavior

### AI-assisted onboarding uses

- summarize uploaded/entered artist material into candidate Artist Brain fields;
- suggest Identity discovery candidates;
- detect candidate Song metadata/story prompts;
- propose the most relevant first workflow from explicit user intent.

### Context

Cold-start context is intentionally sparse. AI must not pretend to know the artist beyond supplied evidence.

### Structured output examples

```text
candidateSummary
candidateDescriptors[]
missingContext[]
suggestedNextWorkflow
rationale
sourceRefs[]
```

### Forbidden

- declare archetype as fact;
- invent artist history;
- fabricate audience learnings;
- claim platform performance without imports;
- auto-activate Identity;
- hide uncertainty.

### Insufficient evidence

Return specific missing context or offer exploration, not fake confidence.

---

## 16. Human approval

User confirms all candidate identity/artist facts before they become authoritative source fields where the Identity/Knowledge domain requires approval.

---

## 17. Validation

- artist name required to create primary Artist;
- invalid/empty uploaded files handled by source import flow;
- optional fields remain optional;
- URLs/platform handles validate format only where supplied;
- duplicate Song handling belongs to Song domain;
- no source field overwritten by AI without visible confirmation.

---

## 18. UI states

### First-use

A concise welcome + clear first action; no product tour dump.

### Empty domain state standard

Every major empty state contains:

```text
What this area is for
Why it is empty / what is missing
Primary next action
Optional secondary action
```

### Partial setup

Show what is available now and what improves with more context.

### Error

Persist completed steps; error in optional integration does not restart onboarding.

### AI unavailable

Offer manual path / continue without AI.

---

## 19. Edge cases

- User already has Artist entity from migration but no onboarding record: infer progress from source entities rather than forcing duplicate setup.
- User changes artist name after onboarding: update Artist source; onboarding history is not authority.
- Imported historical analytics before songs are mapped: Analytics/source workflows handle unmapped state; onboarding need not block.
- User wants no social platforms: core Identity/Song/Production workflows remain usable.
- No release planned: do not force release readiness.
- AI summary conflicts with user’s own statement: user statement wins; conflict may be retained as candidate/rejected evidence if relevant.

---

## 20. Cross-module effects

Onboarding creates/updates authoritative entities through their modules and may set initial Current Focus.

Potential events:

```text
ArtistCreated
OnboardingIntentSelected
IdentitySetupStarted
SongCreated
ProductionCapabilityStarted
OnboardingMinimumReady
OnboardingCompleted
```

---

## 21. Notifications and attention model

Incomplete optional onboarding does not create perpetual high-priority alerts. Attention only surfaces missing setup when it blocks or materially limits the user’s current objective.

---

## 22. Search / filtering / sorting / bulk actions

Not applicable to main onboarding flow. Import steps defer to source-domain wizards.

---

## 23. Analytics and product telemetry

Track:

```text
onboarding_started
onboarding_step_completed
onboarding_step_skipped
onboarding_paused
onboarding_resumed
onboarding_minimum_ready
onboarding_completed
onboarding_first_value_action_started
```

Measure:

- time to minimum ready;
- time to first useful action;
- drop-off by step;
- skip rate;
- AI suggestion acceptance/edit rate;
- percentage of users blocked by optional integrations (target: near zero by design).

---

## 24. Learning feedback

Onboarding answers populate artist/identity candidate context, not validated performance Learnings. Explicit Artist Statements preserve their epistemic type.

---

## 25. Auditability / provenance

Candidate fields should retain whether they came from:

- direct artist input;
- uploaded source;
- AI extraction;
- imported metadata.

Where permanent Knowledge/Identity promotion occurs, source feature audit rules apply.

---

## 26. Desktop / mobile behavior

Both support basic onboarding. Desktop is preferred for Moodboard/Visual DNA and detailed strategy. Mobile can efficiently complete basics, Voice Note capture, simple Song entry and skip/resume.

---

## 27. Accessibility / usability

- step progress is understandable but not punitive;
- optional vs required fields clearly labeled;
- back navigation preserves data;
- no inaccessible drag-only interactions;
- plain-language explanation before specialist terms such as Narrative Track or Identity Version.

---

## 28. Security / privacy / rights

- explain when private artist materials may be processed by connected AI/integrations under product privacy policy;
- private/internal narrative is not exposed to external outputs by default;
- uploaded media inherits rights workflow rather than assuming publishability.

---

## 29. Performance / async jobs

Uploads/transcription/moodboard analysis run through JobService when long-running. Onboarding can proceed past optional background work and show resumable progress.

---

## 30. Acceptance criteria

1. A brand-new user can create Artist Basics and reach a useful next action without connecting any external platform.
2. A user can choose `DEFINE_IDENTITY` and reach Identity Discovery without creating a Song.
3. A user can choose `PLAN_RELEASE`, add a Song/Release and enter the relevant readiness workflow without completing the full Brand Book.
4. Skipping analytics import does not render zero metrics or block access.
5. AI outage still allows Artist Basics and manual setup.
6. AI-extracted identity suggestions remain candidates until confirmed.
7. Re-entering onboarding does not erase Songs, Identity or other domain state.
8. Incomplete optional production setup does not generate a permanent high-severity attention item unless it blocks a current production task.
9. Cold-start AI recommendations clearly disclose limited own-data evidence.
10. Empty states across core modules link to meaningful source actions.

---

## 31. Test matrix

### Unit
- progress derivation;
- optional/required step rules;
- initial intent routing;
- minimum-ready conditions.

### Integration
- Artist create;
- Identity setup entry;
- Song create;
- optional production setup;
- Overview focus after onboarding.

### Agent eval
- no invented artist facts;
- cold-start uncertainty;
- candidate vs confirmed language.

### E2E
- zero-state → identity-first;
- zero-state → release-first;
- skip all optional integrations → enter OS;
- pause/resume;
- AI unavailable fallback.

---

## 32. Open questions

1. Exact `MINIMUM_READY` conditions should be validated during UX prototyping; recommended base: Artist exists + initial intent selected + at least minimal identity context or explicit choice to defer.
2. Should “first useful action” completion mark onboarding `COMPLETED`, or should completion happen when user explicitly dismisses setup? Recommended: minimum ready is automatic, completed is explicit/after first value action.
3. Whether to introduce `MonthlyObjective` during onboarding depends on its future entity decision from Overview spec.

---

## 33. Traceability

| Product requirement | MASTER v1.3 |
|---|---|
| OVR-ONB-001, 006, 013–019 | 339–347, 366, 368 |
| OVR-ONB-002–005 | 16–18, 48, 53–92 |
| OVR-ONB-003 | 341–343 |
| OVR-ONB-007–008, 020 | 368 |
| OVR-ONB-009–010 | 53–60, 62–67 |
| OVR-ONB-011 | 20, 415 |
| OVR-ONB-012 | 18 |
| OVR-ONB-021 | 370 |
| Overall MVP path | 403–411, 449–457 |
