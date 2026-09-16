# Artist OS — Product Principles

**Status:** Active product guidance
**Applies to:** product, UX, engineering, AI orchestration and implementation planning
**Architecture baseline:** MASTER v1.4 remains frozen and normative. This document changes implementation priority and product surface, not domain ownership.

## Product thesis

Artist OS is valuable when it remembers the artist's career, connects context across identity, songs, releases, content, experiments, analytics, decisions and learnings, and helps the artist decide what to do next.

The product is not defined by the number of modules, dashboards or AI generations it contains.

The monetizable core is:

`Context + Memory + Decisions + Execution`

The compounding loop is:

`Context → Hypothesis → Action → Result → Decision → Learning → Reuse → Better Next Action`

## Ten product principles

1. **Complex system, simple surface.** Internal bounded contexts do not define the menu. Deep domain architecture should surface through a small number of user-facing workspaces.
2. **Context before generation.** AI works on assembled canonical context, never as an isolated chatbot that invents artist facts.
3. **Memory must compound.** The product must become more useful after 3, 6 and 12 months because decisions, evidence and learnings are reusable.
4. **Decisions preserve why.** Important choices keep rationale, evidence, source context and reversal history.
5. **AI proposes; humans commit.** AI may explain, generate and prepare actions. High-impact state changes require application validation and explicit human approval.
6. **Unknown is better than invented.** Missing context remains UNKNOWN / NOT CONNECTED / INSUFFICIENT EVIDENCE instead of being filled with generic musician advice.
7. **Capture context as a by-product of work.** Prefer passive evidence from normal workflows over extra CRM-like data entry.
8. **Every recommendation explains itself.** A recommendation should expose what, why, evidence, blockers/uncertainty and what may be learned.
9. **Daily usefulness before feature breadth.** Before adding another major domain, prove that the existing system helps the artist act today.
10. **Deep domains, shallow navigation.** Identity, music, content, intelligence, distribution, analytics and other ownership boundaries can remain deep internally while the primary UI stays small.

## Daily OS acceptance test

An authenticated artist opening Artist OS should be able to answer within 30–60 seconds:

- What is happening now?
- What matters most?
- What should I do next?
- Why is Artist OS recommending this?
- What is blocked or waiting for my judgment?

The primary surface must work with AI disabled.

## Compounding-memory acceptance test

After sustained use, Artist OS should be able to explain a recommendation using accumulated artist-specific history such as:

- prior Decisions;
- validated Learnings;
- Song Brain and Artist Brain context;
- content and execution history;
- experiment and outcome evidence;
- freshness and reversals.

A larger database without better future decisions does not count as compounding value.

## UX rules

- Domain architecture MUST NOT define navigation architecture.
- Canonical models may be rich while forms remain progressive and minimal.
- Default screens prioritize action and judgment over schema exposure.
- Entity pages may be deep; the front door must be simple.
- Do not create generic scores when concrete readiness/blockers are available.
- Do not expose AgentRun IDs, prompt internals or token budgets in primary artist UX.
- Use contextual drill-down for provenance and evidence.

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
