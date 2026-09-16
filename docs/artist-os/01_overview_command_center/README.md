# 01 — Overview / Command Center

**Domain status:** `REVIEW — detailed specification pass complete`

This domain defines the operational front door of Artist OS. It does not own the source data of other domains; it projects, prioritizes and routes attention across them.

## Feature specifications

1. [Overview / Command Center](01_overview-home.md) — current focus, command-center information hierarchy, readiness/performance/learning/decision summaries.
2. [Attention & Bottleneck Model](02_attention-model.md) — explainable priority, bottleneck detection, deduplication, snooze/dismiss/resolution lifecycle.
3. [Command Palette & Quick Actions](03_global-command-palette.md) — `⌘K`, registered commands, contextual navigation and safe quick-start workflows.
4. [System Onboarding & Empty State Journey](04_onboarding.md) — cold start, progressive setup, minimum-ready state and empty-state standard.

## Domain principles

- Overview answers **what needs attention now**, not **what data exists**.
- It is an application projection; source domains remain authoritative.
- No global magic health score.
- No unavailable metric is rendered as zero.
- Attention is explainable and bounded.
- AI is optional for the basic Overview experience.
- Quick actions never bypass source-domain approval or validation.
- Onboarding is progressive and Identity-aware, not a giant mandatory wizard.

## Primary cross-domain dependencies

```text
Identity
Songs / Releases
Campaigns
Pipeline / Calendar
Production / Assets
Distribution / DSP
Analytics
Experiments / Learnings / Decisions
Jobs / Integrations
```

## Requirement namespaces

- `OVR-HOME-*`
- `OVR-ATTN-*`
- `OVR-CMD-*`
- `OVR-ONB-*`

## Next specification dependency

The next deep pass should be `02_identity`, because Overview onboarding/current-focus behavior depends on clear definitions of Identity completeness, Identity activation and Identity Review.
