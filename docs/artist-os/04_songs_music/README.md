# 04 Songs / Music — Detailed Product Specification

**Status:** REVIEW complete — first detailed product pass.

Song is a first-class creative/knowledge context. Each Song has a dedicated **Song Brain namespace**, but that Brain is not a giant document: it is a structured view across song-specific truth, assets, content, experiments and evidence.

## Core boundary

```text
Artist Brain / Identity
        ↓ referenced context
Song Brain
├─ Story / Meaning / Interpretation
├─ Lyrics
├─ Song Segments
├─ Audio Assets / Audio Usage
├─ Song Identity Context
├─ Performances
├─ Content History
├─ Experiments / Learnings
└─ Release Extensions
```

Song Brain MUST NOT duplicate the complete Artist Brain or Identity model.

## Features

- [Song Library](01_song-library.md)
- [Song Detail / Song Brain](02_song-home.md)
- [Story, Meaning & Interpretation](03_story-meaning.md)
- [Lyrics & References](04_lyrics.md)
- [Song Segments](05_segments.md)
- [Audio Assets & Audio Usage](06_audio-assets.md)
- [Song Identity Context](07_song-identity-context.md)
- [Performances](08_performances.md)
- [Song Content History](09_content-history.md)
- [Song Experiments & Learnings](10_song-experiments-learnings.md)
- [Release Extensions](11_release-extensions.md)

## Domain invariants

1. Song-specific evidence stays Song-scoped until explicitly generalized.
2. FACT / ARTIST_INTERPRETATION / AUDIENCE_INTERPRETATION never collapse silently.
3. AI does not invent biography, lyrics, rights, IDs or missing metrics.
4. Historical AudioUsage/Identity/Content lineage remains immutable enough for trustworthy analytics.
5. “Best segment” requires evidence and scope; one post is not a rule.
6. Song Identity Context inherits Identity and uses explicit scoped overrides.
7. Performance/Content/Analytics states remain owned by their native domains, not duplicated in Song Brain.
