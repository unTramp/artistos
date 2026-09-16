# Artist OS — Product Principles

**Status:** Active product guidance
**Applies to:** product, UX, engineering, AI orchestration and implementation planning
**Architecture baseline:** MASTER v1.4 remains frozen and normative. This document changes implementation priority and product surface, not domain ownership.

## Product thesis

Artist OS is valuable when it remembers the artist's career, connects context across identity, songs, releases, content, experiments, analytics, decisions and learnings, and helps the artist decide what to do next.

The product is not defined by the number of modules, dashboards or AI generations it contains.

The monetizable core is:

`Context + Memory + Decisions + Execution`

Artist OS has two related loops and should keep them conceptually distinct.

### User operating loop

`Context → Focus → Action → Result → Better Next Action`

This is the loop the artist should feel in daily use.

### Intelligence loop

`Evidence → Insight / Hypothesis → Experiment → Learning → Decision → Reuse`

This is the loop through which Artist OS accumulates durable artist-specific intelligence.

The product connects the loops by using validated memory, current objectives and domain state to improve future focus and actions.

## Ten product principles

1. **Complex system, simple surface.** Internal bounded contexts do not define the menu. Deep domain architecture should surface through a small number of user-facing workspaces.
2. **Context before generation.** AI works on assembled canonical context, never as an isolated chatbot that invents artist facts.
3. **Memory must compound.** The product must become more useful after 3, 6 and 12 months because decisions, evidence and learnings are reusable.
4. **Decisions preserve why.** Important choices keep rationale, evidence, source context and reversal history.
5. **AI proposes; humans commit.** AI may explain, generate and prepare actions. High-impact state changes require application validation and explicit human approval.
6. **Unknown is better than invented.** Missing context remains UNKNOWN / NOT CONNECTED / INSUFFICIENT EVIDENCE instead of being filled with generic musician advice.
7. **Capture context as a by-product of work.** Prefer passive evidence from normal workflows over extra CRM-like data entry.
8. **Every recommendation explains itself.** A recommendation should expose what, why, evidence, blockers/uncertainty, expected effect and what may be learned.
9. **Daily usefulness before feature breadth.** Before adding another major domain, prove that the existing system helps the artist act today.
10. **Deep domains, shallow attention.** The attention layer must stay simple. Navigation may grow deeper over time, but users must never need to patrol the sidebar to understand what matters now.

## Human-controlled conflict handling

Prior Decision memory is advisory context, not a rule engine.

When a new proposal conflicts with an active prior Decision, Artist OS must follow:

`Detect conflict → explain prior context → ask for override rationale → allow human decision`

The system must never silently block a user from consciously repeating or revisiting a strategy. Reconsideration may be valid when market, song, audience, creative, timing, platform or other conditions have materially changed.

The product should preserve the override rationale so later reviews can distinguish accidental repetition from an intentional re-test under changed conditions.

## Daily OS acceptance test

An authenticated artist opening Artist OS should be able to answer within 30–60 seconds:

- What is happening now?
- What matters most?
- What should I do next?
- Why is Artist OS recommending this?
- What is blocked or waiting for my judgment?
- What objective is this action serving?

The primary surface must work with AI disabled.

## Official demo acceptance test

Every representative product demo should demonstrate all four moments:

1. **TODAY** — Artist OS knows what I should do now.
2. **WHY** — Artist OS can explain why.
3. **MEMORY** — Artist OS remembers what we tried, decided and learned.
4. **LEARN** — when I lack context, Artist OS can offer relevant guidance before I act and return me to execution.

A release that cannot demonstrate these four moments should be considered incomplete as a Daily OS experience, even if individual domain screens are functional.

## Attention vs navigation

Artist OS distinguishes two UX layers:

### Attention Layer
Answers: **What needs my attention now?**

Primary examples:
- Today;
- blockers;
- reviews;
- Next Actions;
- current focus;
- recent validated learning;
- decision review due.

### Navigation Layer
Answers: **Where is the specialist workspace?**

Identity, Songs, Factory, Production, Release, Analytics, Experiments, Knowledge and other domains may remain deep. A larger navigation tree is acceptable only if Today still performs orchestration for the user.

## Current objective as prioritization context

`PlanningObjective` is the first-class current focus context. It does not replace CampaignGoal, RevenueGoal or owning-domain truth.

Attention and recommendation ranking should prefer work that advances the active PlanningObjective when other constraints are comparable.

Example:

`Primary Objective: Prepare Trastevere release and establish initial audience discovery loop.`

An incomplete Trastevere execution should therefore outrank unrelated evergreen maintenance unless a stronger blocker or deadline overrides it.

## Explainability contract

Every system recommendation should support progressive disclosure of:

- **WHY THIS** — the concrete reason it matters now;
- **BASED ON** — objective, domain state, evidence and relevant memory refs;
- **UNCERTAINTY** — what is known vs inferred;
- **EXPECTED EFFECT** — what completing the action unlocks or changes;
- **WHAT WE MAY LEARN** — only when meaningful; operational housekeeping may legitimately have no learning value;
- **OPTIONAL GUIDANCE** — a contextual learning/help reference when the user may need knowledge before executing the action.

Deterministic recommendations need deterministic explanations. AI is not required to explain a workflow blocker.

Guidance is optional metadata on an Action/Recommendation projection, not a requirement to create a Lesson or LMS domain.

## Bottleneck and readiness rules

Metrics, readiness and bottlenecks should lead to work rather than exist as passive BI.

Prefer:

`Production bottleneck → Schedule batch shoot → unlock 5–7 waiting ContentUnits`

and:

`Release blocked → artwork missing / pitch incomplete / smart link unverified → Resolve blockers`

over standalone percentage scores.

Do not use a readiness percentage unless the underlying model is explicitly normalized and defensible. Concrete passed checks and blockers are preferred.

## Compounding-memory acceptance test

After sustained use, Artist OS should be able to explain a recommendation using accumulated artist-specific history such as:

- prior Decisions;
- validated Learnings;
- Song Brain and Artist Brain context;
- content and execution history;
- experiment and outcome evidence;
- freshness and reversals.

A larger database without better future decisions does not count as compounding value.

The system should also detect accidental repetition of known bad strategies. If a proposal materially conflicts with an active prior Decision, the product should surface that conflict and require an explicit override rationale before recommitting — but must still allow the human to proceed.

## Decision model forward compatibility

Decision may exist without Learning, Insight or Experiment — for example, a purely operational or strategic decision.

However, the initial Decision contract and schema/API design must be forward-compatible with later lineage to:

- Evidence;
- Insight;
- Hypothesis;
- Experiment;
- Learning;
- OperationalAction.

PRs implementing Learning/Insight/Experiment must not require redesigning the fundamental Decision identity, subject model or provenance shape.

## Decision lineage

Decision Memory is not administrative metadata. Where possible, users should be able to traverse provenance such as:

`Experiment → Insight → Learning → Decision → OperationalAction`

This lineage is a key trust mechanism: Artist OS should be able to show where a recommendation or decision came from.

Missing upstream nodes are allowed. Do not fabricate lineage to satisfy a visual pattern.

## System Learning vs Artist Learning

These are distinct concepts.

### System Learning

Artist-specific intelligence created from evidence:

`Metrics / Observation → Insight → Hypothesis → Experiment → Learning → Decision`

Canonical `Learning` belongs here.

### Artist Learning

Educational support that helps the human understand how to perform a real task. This should not reuse the canonical `Learning` entity name.

Use a separate UX concept such as **Contextual Guidance**, **Learn** or **Micro-guide**.

Initial model:

`Need → Learn → Apply → Measure`

Do not build a full LMS by default. Start with contextual guidance attached to real current work.

## Recommendation maturity

The product should make compounding value visible without inventing a global intelligence score.

Examples:

**Early context**
- Identity;
- Song Brain;
- authoritative platform knowledge.

**Artist-specific evidence**
- publications;
- experiments;
- validated Learnings;
- prior Decisions;
- outcome history.

The UI may explain the recommendation source/maturity qualitatively and with concrete source counts when those counts are real.

## Weekly Review contract

Weekly Review is a recurring decision ritual, not a BI report.

It should end with:

- what changed;
- what was learned;
- what remains uncertain;
- decisions to make;
- next actions / next focus.

Deterministic facts come first. Optional AI may summarize or draft decision candidates, but humans commit strategic decisions.

## UX rules

- Domain architecture MUST NOT define navigation architecture.
- Canonical models may be rich while forms remain progressive and minimal.
- Default screens prioritize action and judgment over schema exposure.
- Entity pages may be deep; the front door must be simple.
- Do not create generic scores when concrete readiness/blockers are available.
- Do not expose AgentRun IDs, prompt internals or token budgets in primary artist UX.
- Use contextual drill-down for provenance and evidence.
- Content Factory answers **What can we create?**; Today answers **What should we do now?**
- AI should appear inside workflows; a chatbot may exist, but it must never be required to operate Artist OS.

## Product metrics for MVP validation

### Time to Meaningful Next Action
Time from opening Today to initiating a useful career action. Target: under 60 seconds.

### Attention Action Completion Rate
For surfaced attention items, measure completed / opened / snoozed / dismissed / ignored.

### Memory Reuse Rate
Share of recommendations that cite reusable Decision, Learning, Artist Brain, Song Brain or other durable context.

### Automatic Context Capture Ratio
Context captured as a by-product of normal work divided by total newly captured context.

## Scope gate for new features

Before adding a major feature, ask:

> Does this help Artist OS understand the artist's current state, make a better next decision, execute that decision, or learn from the result?

If the answer is no, treat the feature as probable scope creep.
