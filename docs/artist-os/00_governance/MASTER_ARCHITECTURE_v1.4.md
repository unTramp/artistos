# MASTER-ТЗ v1.4
## Artist OS — Identity, Content, Production, Distribution, Growth, Business & Intelligence

**Версия:** 1.4
**Дата архитектуры:** 16 September 2026
**Статус:** Current Master Source of Truth
**Первичный пользователь:** независимый музыкальный артист
**Первичная реализация:** single-artist first
**Интерфейс:** Desktop Web Application + Mobile/PWA production workflows
**Архитектурный принцип:** Human-Controlled / AI-Assisted / Evidence-Driven / Closed-Loop Learning
**Статус Advertising/Publicity:** research boundary; не входит в нормативное ядро v1.4, кроме общих extension points.

> v1.4 заменяет MASTER-ТЗ v1.3 как нормативный архитектурный документ после merge freeze-PR в `main`. До merge v1.3 остаётся Source of Truth. v1.3 сохраняется как архивная архитектурная точка. v1.4 применяет только согласованный delta из ACP-001…ACP-006 и нормативных companion contracts AR-001…AR-062; остальные продуктовые принципы v1.3 сохраняются.

# ЧАСТЬ I. VERSION SCOPE & ARCHITECTURAL FREEZE

## 1. Что фиксирует v1.4

v1.4 фиксирует Organic & Operational Core Artist OS: идентичность артиста, narrative, песни, контент, производство, assets, distribution, DSP, organic growth, market intelligence, fan value/business и общий analytics/learning контур.

## 2. Что сознательно не смешивается с v1.4

Advertising Intelligence и Publicity/PR исследуются следующими отдельными потоками. v1.4 содержит только интерфейсы расширения Campaign/Attribution/Research для будущего подключения этих доменов.

## 3. Новое продуктовое имя

Рабочее верхнеуровневое название продукта — **Artist OS**. `Artist Content OS / AI Content Factory` остаётся историческим названием и названием одного из внутренних модулей, но больше не описывает весь продукт.

## 4. Почему Content OS стало узким

Система теперь охватывает не только производство контента, но также Artist Identity, narrative, owned media, DSP lifecycle, platform capabilities, fan value, offers, revenue planning, market intelligence и decision memory.

## 5. Нормативность документа

Если более старые заметки, курсы, prompt'ы или implementation decisions конфликтуют с этим MASTER-ТЗ, приоритет имеет v1.4, пока человек явно не утвердит изменение через ACP/architecture freeze.

### Нормативные companion architecture contracts

Для v1.4 контракты `AR-001…AR-062` из `ARCHITECTURE_RESOLUTION_PASS1.md` являются нормативным companion layer. Они уточняют cardinality, ownership, lifecycle и cross-domain semantics без дублирования всех деталей в основном MASTER.

Правило приоритета:

```text
MASTER v1.4 core
↓
AR-001…AR-062 companion contracts
↓
Full Product Specs
↓
Engineering Specs
↓
implementation details
```

Если companion contract конфликтует с core MASTER v1.4, core MASTER имеет приоритет и изменение требует нового ACP.

# ЧАСТЬ II. PRODUCT VISION

## 6. Что мы создаём

Artist OS — операционная система независимого артиста, которая связывает творческую идентичность, музыку, контент, производство, дистрибуцию, рост, fan value и накопленное обучение в одну управляемую систему.

## 7. Чем продукт не является

Продукт не является просто генератором постов, social scheduler, аналитическим dashboard, файловым менеджером, рекламным кабинетом, CRM, бухгалтерией или ChatGPT-wrapper.

## 8. Главный продуктовый вопрос

Со временем система должна отвечать: **что артисту стоит создать/сделать следующим, почему, на основании каких данных, как это реализовать доступными ресурсами и чему это позволит научиться?**

## 9. Главный накопительный актив

```text
Artist Identity
+ Artist Brain
+ Song Brains
+ Narrative History
+ Assets & Content Lineage
+ Publications
+ Experiments
+ Validated Learnings
+ Audience / Market Signals
+ Business Signals
+ Decision History
```

## 10. Основной moat

Moat строится не вокруг количества AI-генераций, а вокруг всё более точной модели конкретного артиста: его voice, identity, songs, audience response, production constraints, content patterns, market response, business economics и истории решений.

## 11. Closed loop

```text
IDENTITY / KNOWLEDGE
↓
CONTEXT
↓
STRATEGY
↓
DECISION
↓
CONTENT / OFFER / RELEASE ACTION
↓
PRODUCTION
↓
DISTRIBUTION
↓
AUDIENCE RESPONSE
↓
METRICS
↓
INSIGHT
↓
HYPOTHESIS
↓
EXPERIMENT
↓
LEARNING
↓
DECISION
↓
BETTER NEXT ACTION
```

# ЧАСТЬ III. TOP-LEVEL DOMAIN MAP

## 12. Основные домены

```text
IDENTITY
NARRATIVE
MUSIC / SONG / RELEASE
CONTENT
PLANNING
PRODUCTION
ASSETS
DISTRIBUTION
DSP
GROWTH
BUSINESS / FAN VALUE
INTELLIGENCE / LEARNING
```

## 13. Cross-cutting domains

```text
KNOWLEDGE
CONTEXT ASSEMBLY
RESEARCH CLAIM GOVERNANCE
JOBS
AI / AGENTS
PLATFORM CAPABILITIES
RIGHTS / PRIVACY
AUDIT / DECISIONS
```

## 14. Campaign как orchestration boundary

Campaign связывает Song/Release с Content, Distribution, DSP, Growth, Website, Creator Collaboration, Commerce и будущими Advertising/Publicity модулями. Campaign не должен превращаться в god-object; каждый домен хранит собственные сущности.

## 15. Target map

```text
ARTIST
├─ IDENTITY
├─ NARRATIVE
├─ SONGS / RELEASES
├─ CONTENT
├─ PRODUCTION / ASSETS
├─ DISTRIBUTION / DSP
├─ GROWTH / MARKETS
└─ BUSINESS / FAN VALUE
        ↓
  SHARED INTELLIGENCE
Analytics → Insight → Hypothesis → Experiment → Learning → Decision
```

# ЧАСТЬ IV. PRODUCT PRINCIPLES

## 16. Artist First

AI усиливает артиста. Он не заменяет личность, художественный выбор, исполнение, голос, private story или право артиста намеренно сделать неэффективное, но важное для него творческое решение.

## 17. Identity Before Optimization

Analytics не имеет права автоматически переписывать identity. Высокий performance deviation создаёт hypothesis, а не rebrand.

## 18. Original Content First

Базовое сырьё: реальные performances, songs, voice notes, thoughts, BTS, studio/live moments, photos, stories, creator interactions. Licensed/generated materials являются supplementary assets, если identity strategy не предполагает обратного.

## 19. Learnings > Output Volume

Система не оптимизируется под максимальное число постов. Цель — улучшать качество решений и объём полезного evidence на единицу творческих усилий.

## 20. Human Approval

Human approval обязателен для publishing, permanent knowledge, identity changes, validated rule promotion, destructive actions, significant strategy changes и будущего ad spend.

## 21. Evidence Before Rule

Observation, anecdote, course advice, platform rumor или один successful post не становятся validated learning без evidence path.

## 22. Correlation ≠ Causation

Analytics должен явно отличать association, temporal coincidence и причинный вывод. Causal claim допускается только при достаточном design/evidence.

## 23. System Useful Without AI

Основные сущности, pipeline, calendar, assets, publications, metrics, experiments и decisions должны оставаться полезными при отключенном AI provider.

## 24. Explainability

Recommendation должна отвечать `Why this?`, `Based on what?`, `What is uncertain?`, `What will we learn?`.

## 25. No fake optimization certainty

Не использовать meaningless `94/100`, guaranteed virality, guaranteed algorithm hacks или fixed success probabilities без реальной модели и данных.

## 26. No deceptive scarcity

OS не должна рекомендовать ложные лимиты товара, ложный sold-out pressure или фиктивные countdowns. Допустим только реальный quantity/time/preorder constraint.

## 27. No manipulation framing

Artist Identity, symbolic anchors и fan value используются для coherent creative communication и value exchange, а не для скрытой психологической манипуляции.

# ЧАСТЬ V. EPISTEMIC & RESEARCH GOVERNANCE

## 28. Knowledge Claim Types

```text
FACT
ARTIST_STATEMENT
OBSERVATION
HYPOTHESIS
EXTERNAL_HEURISTIC
VALIDATED_LEARNING
```

## 29. ResearchClaim

```text
id
claim
sourceId
claimType
authority
jurisdiction?
platform?
accountType?
validAsOf
freshUntil?
verificationStatus
supersededBy?
```

## 30. Verification Status

```text
UNVERIFIED
SOURCE_ONLY
CROSS_CHECKED
PRIMARY_SOURCE_VERIFIED
STALE
CONTRADICTED
```

## 31. Authority Levels

```text
A_PRIMARY
B_REPUTABLE
C_PRACTITIONER
D_ANECDOTAL
```

## 32. Practitioner advice

Курсы и agency tactics сохраняются как practitioner evidence, но не могут автоматически становиться platform rule.

## 33. Freshness

Platform capabilities, API rules, eligibility, algorithms и UI-specific workflows имеют TTL/freshness. Own historical analytics не удаляются, но получают time decay там, где это уместно.

## 34. Research Promotion Pipeline

```text
SOURCE
↓
CLAIM EXTRACTION
↓
VERIFY / CLASSIFY
↓
REJECT | HEURISTIC | CANDIDATE | PROMOTE
↓
DOMAIN KNOWLEDGE / EXPERIMENT
```

## 35. Primary source preference

Для platform rules, APIs, eligibility, monetization и legal-ish operational facts предпочитать official platform documentation. Practitioner sources используются для hypotheses и creative tactics.

# ЧАСТЬ VI. TECHNOLOGY & APPLICATION ARCHITECTURE

## 36. Frontend

```text
Next.js
React
TypeScript
```

## 37. UI Layer

```text
Tailwind CSS
shadcn/ui or thin custom component layer
Lucide Icons
```

## 38. Backend

MVP: Next.js server/application layer + worker runtime. Архитектура допускает выделение backend service позже без переписывания domain.

## 39. Database

PostgreSQL как основная транзакционная БД.

## 40. ORM

Drizzle preferred, если repository не использует другое решение. Prisma допускается при существующем выборе/обосновании.

## 41. Vector Layer

pgvector для semantic retrieval, если инфраструктура PostgreSQL это поддерживает.

## 42. Storage

```text
StorageProvider
├─ Local filesystem (development)
└─ S3-compatible (production)
```

## 43. Layers

```text
presentation/
application/
domain/
infrastructure/
ai/
integrations/
workers/
```

## 44. Domain Independence

Domain не зависит напрямую от OpenAI, TikTok, Meta, YouTube, Spotify, Vercel, AWS или конкретной queue/storage реализации.

## 45. Modular monolith first

Не вводить Kafka, Kubernetes, service mesh и premature microservices до доказанной operational необходимости.

## 46. Repository Interfaces

```text
ArtistRepository
IdentityRepository
SongRepository
ReleaseRepository
PlanningObjectiveRepository
ContentRepository
AssetRepository
PublicationRepository
MetricsRepository
KnowledgeRepository
ExperimentRepository
LearningRepository
DecisionRepository
OperationalActionRepository
TakeRepository
BusinessRepository
```

## 47. Provider Interfaces

```text
AIProvider
TranscriptionProvider
EmbeddingProvider
StorageProvider
QueueProvider
PlatformProvider
PublishingProvider
AnalyticsImportProvider
```

# ЧАСТЬ VII. CORE ARTIST / SONG / CAMPAIGN MODEL

## 48. Artist

```text
id
name
artistName
bio
story
positioning
values
languages
genres
markets
targetAudiences
currentGoals
createdAt
updatedAt
```

## 49. Song

```text
id
artistId
title
type
originalArtist?
isOriginal
genre
mood
language
story
meaning
lyricsReference
isrc?
platformLinks
createdAt
```

Release lifecycle (`releaseStatus`, `releaseDate`, UPC и release-specific metadata) не является canonical Song truth в v1.4. Legacy Song release fields допускаются только как compatibility projection во время миграции.

### 49A. Release

```text
id
artistId
title
type: SINGLE|EP|ALBUM|COMPILATION|OTHER
status: DRAFT|PLANNED|SCHEDULED|RELEASED|DELAYED|CANCELLED|ARCHIVED
releaseDate?
originalReleaseDate?
artworkAssetId?
upc?
labelName?
createdAt
updatedAt
```

Release является canonical owner release lifecycle и release-specific metadata.

### 49B. ReleaseTrack

```text
releaseId
songId
sequence
versionLabel?
isFocusTrack
```

Одна Song может входить в несколько Releases без дублирования Song Brain. Song meaning/lyrics/segments остаются Song-owned.

## 50. Campaign Types

```text
PRE_RELEASE
RELEASE
POST_RELEASE
EVERGREEN
AUDIENCE_GROWTH
ARTIST_INTRODUCTION
IDENTITY_BUILDING
EXPERIMENT
BUSINESS
```

## 51. Campaign Goals

```text
FOLLOWERS
REACH
ENGAGEMENT
PROFILE_VISITS
MUSIC_DISCOVERY
STREAMS
SAVES
AUDIENCE_LEARNING
MARKET_LEARNING
REVENUE
MEMBERSHIP
```

## 52. Campaign linkage

Campaign связывает target context с identity version, era, narrative tracks, content units, publications, DSP actions, website experience, growth experiments и offers. Campaign остаётся orchestration boundary и не владеет lifecycle Song/Release.

### 52A. CampaignTarget

```text
campaignId
targetType: ARTIST|SONG|RELEASE
targetId?
role: PRIMARY|RELATED
```

MVP допускает не более одного `PRIMARY` target на Campaign и zero-or-more `RELATED` targets. Target relation не переносит ownership целевой сущности в Campaign.

# ЧАСТЬ VIII. ARTIST IDENTITY ENGINE

## 53. Artist Identity Engine

First-class bounded context, определяющий художественный, эмоциональный, визуальный и narrative язык артиста. Не сводится к одному `artist.visualIdentity JSON`.

## 54. ArtistIdentity

```text
id
artistId
activeVersionId
status
createdAt
updatedAt
```

## 55. ArtistIdentityVersion

```text
id
artistIdentityId
version
name
status
createdAt
approvedAt?
```

## 56. Identity Version Status

```text
DRAFT
REVIEW
ACTIVE
ARCHIVED
```

## 57. Identity versioning

Minor refinements могут повышать 1.0→1.1; существенный rebrand/creative reset — major version 2.0. Исторические Content Units сохраняют ссылку на использованную версию.

## 58. ArchetypeProfile

```text
primaryArchetype
secondaryArchetype?
confidence
status
personalityEvidence[]
lyricEvidence[]
musicEvidence[]
visualEvidence[]
externalFeedback[]
```

## 59. Archetype enum

```text
INNOCENT
EVERYMAN
HERO
CAREGIVER
EXPLORER
OUTLAW
LOVER
CREATOR
JESTER
SAGE
MAGICIAN
RULER
```

## 60. Archetype selection

AI может предлагать candidates и rationale, но итоговый архетип подтверждается человеком. Архетип — creative model, не психологический диагноз.

## 61. EmotionalTerritory

```text
primaryEmotions[]
secondaryEmotions[]
emotionalContrasts[]
forbiddenEmotionalModes[]
descriptors[]
```

## 62. Identity Listening Session

Guided reflection session над собственной музыкой. Может записываться voice note и транскрибироваться. Система извлекает candidate associations, а не объявляет их объективной психологией.

## 63. SensoryAssociation

```text
sessionId
identityVersionId
songId?
type
value
confidence
occurrenceCount
status
```

## 64. Sensory Association Types

```text
COLOR
TEXTURE
OBJECT
PLACE
MEMORY
SYMBOL
LIGHTING
EMOTION
MATERIAL
ERA
WEATHER
MOVEMENT
PERSON
OTHER
```

## 65. Moodboard

```text
id
identityVersionId
name
status
createdAt
```

## 66. MoodboardItem

```text
imageAssetId?
sourceUrl?
sourceType
userTags[]
aiTags[]
likedReason
dislikedElements[]
rightsStatus
```

## 67. Moodboard analysis

AI может выделять recurring colors, textures, lighting, composition, fashion, objects, eras, materials, typography, art style и environment. Выводы остаются suggestions до human confirmation.

## 68. VisualPattern

```text
type
value
frequency
confidence
sourceItemIds[]
```

## 69. VisualIdentitySystem

```text
ColorSystem
TextureProfile
LightingProfile
ArtStyleProfile
CompositionRules
FashionRules
EnvironmentRules
TypographySystem
VisualTreatmentProfile
SymbolicAnchors
```

## 70. ColorSystem

```text
primaryColors[]
secondaryColors[]
accentColors[]
forbiddenColors[]
temperature
saturationRange
brightnessRange
```

## 71. TextureProfile

```text
preferred[]
allowed[]
avoid[]
intensityRange
```

## 72. LightingProfile

```text
contrast
direction
temperature
shadowPreference
keyLightStyle
signaturePatterns[]
avoid[]
```

## 73. ArtStyleProfile

```text
primaryStyle
secondaryInfluences[]
descriptors[]
examples[]
avoid[]
```

## 74. CompositionRules

```text
preferredFraming[]
subjectPlacement[]
negativeSpaceRules
cameraDistancePreferences[]
avoid[]
```

## 75. FashionRules

```text
preferredSilhouettes[]
materials[]
colors[]
eras[]
signatureItems[]
avoid[]
```

## 76. TypographySystem

```text
headlineFont
bodyFont
fallbackFonts[]
headlineRules
bodyRules
caseRules
trackingRules
allowedWeights[]
```

## 77. VisualTreatmentProfile

```text
temperature
contrast
saturation
grain
blackPoint
highlightStyle
shadowStyle
skinTreatment
sharpness
vignette
```

## 78. Visual Treatment Family

Позволяет иметь DAY/NIGHT/STUDIO/PERFORMANCE presets в едином visual family вместо правила `один фильтр навсегда`.

## 79. RetouchingPolicy

```text
NONE
MINIMAL
EDITORIAL
POLISHED
```

## 80. PresenceProfile

```text
facePresence: HIGH|MEDIUM|LOW|OPTIONAL
personalVoicePresence: HIGH|MEDIUM|LOW
performancePresence: HIGH|MEDIUM|LOW
```

## 81. SymbolicAnchor

```text
id
identityVersionId
name
category
meaning
narrativeOrigin
importance
usageFrequency
visibility
allowedVerticals[]
variations[]
```

## 82. Symbolic Anchor principle

Anchor — повторяемый художественный язык, не гарантия subconscious effect. Хранить intended meaning/association, а не псевдонаучную causal claim.

## 83. IdentityNarrative

```text
title
premise
artistRole
world
centralConflict
coreDesire
themes[]
symbols[]
locations[]
eras[]
internalCanon
audienceFacingFragments[]
```

## 84. MystiquePolicy

```text
revealMode: OPEN|PARTIAL|HIGH_MYSTIQUE
protectedFacts[]
allowedHints[]
forbiddenExplanations[]
interpretiveSpaceRules[]
```

## 85. InterpretationPolicy

```text
songExplanationLevel
narrativeExplanationLevel
protectedMeanings[]
preferredCommunication: DIRECT|POETIC|SUGGESTIVE|AMBIGUOUS
```

## 86. EraIdentity

```text
id
artistId
identityVersionId
name
startDate
endDate?
narrativeChapter
visualOverrides
newAnchors[]
retiredAnchors[]
colorOverrides
status
```

## 87. IdentityConstraint

```text
type
scope
priority: NON_NEGOTIABLE|STRONG|PREFERRED|OPTIONAL|EXPERIMENTAL
rule
reason
source
```

## 88. IdentityDeviation

```text
contentUnitId
identityVersionId
reason: EXPERIMENT|ERA_TRANSITION|CREATIVE_EXCEPTION|PLATFORM_REQUIREMENT
notes
approvedBy
createdAt
```

## 89. Identity Guard

Проверяет visual/narrative/tone alignment, mystique, era consistency и intentional deviations. Выход: ALIGNED / PARTIALLY_ALIGNED / OUTSIDE_IDENTITY с объяснениями, без fake score.

## 90. Brand Book Compiler

Brand Book генерируется из structured Identity data и не является source of truth.

## 91. BrandBookVersion

```text
identityVersionId
eraIdentityId?
version
generatedAt
mode: INTERNAL|EXTERNAL_CREATOR
sections[]
exportFormat: WEB|PDF
```

## 92. Identity Wizard

```text
Archetype Discovery
→ Listening Session
→ Sensory Associations
→ Candidate Review
→ Moodboard
→ Pattern Analysis
→ Visual DNA
→ Narrative
→ Symbolic Anchors
→ Mystique
→ Vertical Rules
→ Approval
→ Identity Version
→ Brand Book
```

# ЧАСТЬ IX. NARRATIVE ARCHITECTURE

## 93. Narrative ≠ Pillar ≠ Vertical

Narrative отвечает `какую часть большой истории мы рассказываем`; Pillar — `о чём content`; Vertical — `в каком medium/production lane`.

## 94. NarrativeTrack

```text
id
artistId
identityVersionId
eraIdentityId?
role
name
purpose
themes[]
narrativeQuestions[]
symbolicAnchors[]
allowedDisclosures[]
targetShare?
status
```

## 95. Narrative roles

```text
CORE_NARRATIVE
HUMAN_JOURNEY
SECONDARY
EXPERIMENTAL
```

## 96. A/B/C heuristic

Модель 50/30/20 из practitioner material хранится как optional template, не universal requirement. Третий track не обязателен.

## 97. SignatureDifferentiator

```text
name
type: INSTRUMENT|CHARACTER|OBJECT|VISUAL|BEHAVIOR|FORMAT|SOUND|PHRASE|OTHER
description
identityVersionId
importance
applicableVerticals[]
usageRules
fatigueRisk
```

## 98. X-factor separation

X-factor рассматривается как поперечный differentiator identity и не обязан быть C-storyline.

## 99. NarrativeBeat

```text
trackId
title
description
status: PLANNED|ACTIVE|TOLD|ARCHIVED
sequence?
contentUnitIds[]
```

## 100. NarrativeMixPlan

```text
period
trackTargets[]
actualMix[]
notes
```

## 101. Narrative Coverage

UI показывает target vs actual narrative mix отдельно от Content Pillar mix. Отклонение — warning/context, не ошибка.

## 102. Narrative Analytics

Поддерживать performance по narrative track: median reach, shares, follows, comments, music conversion, sample size и confidence.

# ЧАСТЬ X. SONG BRAIN & MUSIC INTELLIGENCE

## 103. Song Brain

Каждая песня имеет собственный knowledge namespace и не копирует целиком Artist Identity.

## 104. Song Brain Sections

```text
Story
Meaning
Interpretation
Lyrics
Key Moments
Audio Segments
Visual Direction
Audience Hypotheses
Identity Context
Performances
Content History
Experiments
Learnings
```

## 105. Interpretation labels

```text
FACT
ARTIST_INTERPRETATION
AUDIENCE_INTERPRETATION
```

## 106. SongIdentityContext

```text
songId
identityVersionId
eraIdentityId?
songSpecificVisualNotes
songSpecificAnchors[]
allowedOverrides[]
```

## 107. SongSegment

```text
id
songId
startTime
endTime
section
lyrics
emotionalTags[]
energyLevel
storyMeaning
hookPotential
previousUsageCount
```

## 108. Song Segment sections

```text
INTRO
VERSE
PRE_CHORUS
CHORUS
BRIDGE
OUTRO
CUSTOM
```

## 109. Segment Intelligence

Analytics сравнивает разные отрезки одной песни по executions и platforms: usage count, median views, share/save/follow/music conversion, confidence.

## 110. AudioAsset

Audio — first-class entity: OFFICIAL_MASTER, LIVE, ACOUSTIC, DEMO, INSTRUMENTAL, VOCAL_ONLY, VOICE_NOTE, EXTERNAL_SOUND, PLATFORM_SOUND.

## 111. AudioUsage

```text
audioAssetId
songId
segmentStart
segmentEnd
segmentName
sourceType
mixVersion
platformSoundId?
platformSoundUrl?
usageMode
foregroundLevel
backgroundLevel
rightsStatus
```

## 112. ReleaseExtension

```text
type: REMIX|ACOUSTIC|LIVE|STRIPPED|ALT_VERSION|COLLAB
parentReleaseId
releaseId
objective
status
```

`VIDEO` не является ReleaseExtension в v1.4. Video work принадлежит ContentUnit / DSPVideo / Asset / Publication согласно существующим ownership rules.

# ЧАСТЬ XI. KNOWLEDGE & CONTEXT ASSEMBLY

## 113. Hot/Warm/Cold

```text
HOT: identity summary, hard rules, active goal/campaign/era
WARM: Song Brain, complete identity, learnings, vertical/platform playbooks, active experiments
COLD: old posts, transcripts, research, archived campaigns, comments, historical competitor research
```

## 114. Artist Brain

```text
Identity Summary
Story
Positioning
Values
Tone of Voice
Audience
Content Philosophy
Hard Rules
Anti-Patterns
Validated Learnings
```

## 115. Artist Brain boundary

Detailed archetype/visual DNA/narrative/mystique остаются в Artist Identity Engine; Artist Brain содержит compact summary для повседневного контекста.

## 116. Tone Corpus

Хранить реальные captions, voice transcripts, messages, interviews, comments с labels AUTHENTIC/GOOD/NEUTRAL/DO_NOT_COPY/OUTDATED.

## 117. Anti-AI Style Guide

Запрещать generic inspirational clichés, unnecessary overdrama, corporate promo language, repetitive CTA/rhetorical patterns и бессмысленное перефразирование недавних captions.

## 118. Candidate Knowledge

```text
statement
sourceId
suggestedScope
suggestedDestination
confidence
createdAt
status
```

## 119. Candidate destinations

```text
ARTIST_BRAIN
SONG_BRAIN
IDENTITY
ERA
PLATFORM_KNOWLEDGE
BUSINESS_KNOWLEDGE
```

## 120. Context Assembler

Dedicated application service создаёт минимально достаточный context pack для конкретной задачи. Агент не загружает весь Brain самостоятельно.

## 121. Context Request

```text
taskType
artistId
songId?
campaignId?
platform?
goal?
contentType?
identityVersionId?
market?
```

## 122. IdentityContextCapsule

Compact representation: archetype, emotional territory, active era, key colors/textures/lighting, narrative summary, anchors, mystique, avoid rules. Не передавать весь Brand Book.

## 123. Context Pack

```text
HardRules
IdentityCapsule
ArtistSummary
RelevantSongSummary
CurrentCampaign
RelevantLearnings
RelevantPlatformKnowledge
RelevantMarketKnowledge
SelectedStyleExamples
SourceReferences
```

## 124. Context Priority

```text
1 Explicit request
2 Safety / hard rules
3 Identity constraints
4 Artist identity / voice
5 Song context
6 Validated own-data learning
7 Campaign
8 Fresh platform/market knowledge
9 Historical examples
```

## 125. Context budgets

```text
maxChunks
maxTokens
maxExamples
maxLearnings
```

## 126. Context observability

AgentRun сохраняет sources/chunks/rules/token estimate и итоговый assembled context metadata для debugging.

# ЧАСТЬ XII. CONTENT INTELLIGENCE

## 127. Content Pillars

```text
PERFORMANCE
ACOUSTIC
STORY
PERSONALITY
BTS
LYRICS
REACTION
COMMUNITY
PHOTO
PROMO
RELEASE
EXPERIMENTAL
```

## 128. Content Verticals

```text
COVER_ART
PHOTOGRAPHY
MUSIC_VIDEO
SHORT_FORM_VIDEO
LONG_FORM_VIDEO
LIVE_SHOW
PRESS
MERCH
PACKAGING
WEBSITE
SOCIAL_PROFILE
```

## 129. Content Modes

```text
CAMPAIGN
EVERGREEN
OPPORTUNISTIC
EXPERIMENTAL
```

## 130. Content Angle

```text
id
artistId
songId?
campaignId?
title
idea
pillar
mode
goal
audience
platformTargets
requiredAssets
learningValue
status
```

### 130A. ContentNarrativeLink

```text
contentEntityType: ANGLE|CONTENT_UNIT
contentEntityId
narrativeTrackId
role: PRIMARY|SECONDARY
createdAt
```

Rules:

- максимум один PRIMARY NarrativeTrack на Content Angle / ContentUnit;
- zero-or-more SECONDARY links;
- Angle → ContentUnit conversion snapshot'ит attribution;
- default Narrative Mix считает distinct published ContentUnits только по PRIMARY track;
- multi-platform Publications не умножают Narrative Mix;
- secondary overlap показывается отдельно и не используется для искусственного увеличения coverage.

## 131. Content Unit

Конкретная production unit. ID format `[SONG]-[TYPE]-[NUMBER]` там, где Song применим.

## 132. Content Unit Metadata

```text
angleId
identityVersionId
eraIdentityId?
identityDeviationId?
hookType
hookText
durationTarget
format
platformTargets
CTA
caption
keywords
editBrief
priority
status
```

## 133. Content State Machine

```text
IDEA → APPROVED → SCRIPT_READY → TO_SHOOT → SHOT → EDITING → REVIEW → READY → SCHEDULED → PUBLISHED → MEASURING → ANALYZED → ARCHIVED
Additional: BLOCKED | REJECTED | PAUSED
```

## 134. HookVariant

```text
spokenHook
textHook
visualHook
audioHook
hookPattern
emotionalMechanism
durationToHook
experimentId?
```

## 135. Hook Taxonomy

```text
LYRIC_FIRST
PERFORMANCE_FIRST
QUESTION
CONFESSION
CONTRAST
VISUAL_SURPRISE
EMOTIONAL_LINE
STORY_OPEN
COLD_OPEN
SONG_IMMEDIATE
```

## 136. EmotionalHookType

```text
CONFESSION
CURIOSITY
SURPRISE
EMPATHY
HUMOR
ASPIRATION
NOSTALGIA
TENSION
INTIMACY
EXPERIMENTAL
```

## 137. Hook A/B/C

Variants должны относиться к одному базовому concept, если эксперимент должен менять только hook.

## 138. Content Factory Inputs

```text
Song / Release
Campaign
Goal
Platform
Market?
Production Capacity
Identity Version
Era
Available Assets
```

## 139. Factory first step

Первый AI-step генерирует Content Angles, а не сразу captions.

## 140. Angle Card

```text
Idea
Why
Pillar
Narrative Track
Audience
Goal
Identity Fit
Novelty
Required Assets
Production Effort
Learning Opportunity
```

## 141. Execution package

```text
Hook
Structure
Script / Performance Concept
Shot List
Audio Segment
Production Intent
Edit Brief
Caption
CTA
Platform Notes
Identity Constraints
```

## 142. Creative Exploration Session

Separate divergent/convergent workflow для wildcard/adjacent ideas. Prompts могут включать confession, surprise, empathy, humor, nostalgia, transformation, intimacy, experimental.

## 143. No substance-assisted ideation

Система не рекомендует alcohol/recreational substances как creative technique.

## 144. Novelty Tracking

Сравнивать concept, visual setup, hook style, audio segment, format и narrative. Выход HIGH/MEDIUM/LOW + similar units.

## 145. Identity repetition vs execution repetition

Stable identity anchors не штрафуются так же, как повторение одного room/pose/framing/hook/song segment.

## 146. Pattern Fatigue

```text
FRESH
HEALTHY
WATCH
SATURATED
```

## 147. Fatigue signals

Relative performance trend, frequency, similarity, audience response, sample size, time window.

# ЧАСТЬ XIII. PLANNING, EVERGREEN & CALENDAR

## 148. Evergreen Continuity

OS должна предотвращать системное исчезновение между релизами, но не требовать filler content ради cadence.

## 149. Evergreen Pool

```text
Performance
Acoustic
BTS
Studio
Personal
Live
Story
Lyric
Editorial Photo
Recurring Series
Community
Voice Note Story
Archive
```

## 150. RecurringSeries

```text
id
artistId
name
concept
narrativeTrackId?
pillar
cadence
platforms[]
identityRules
status
```

## 151. ContentRhythmTemplate

Шаблон задаёт preferred monthly/weekly rhythm, но не жёсткие даты и не universal frequency.

## 152. ContentSlot

```text
dateWindow
platform
mode: PLANNED|FLEX|CAMPAIGN|EXPERIMENT
preferredPillar?
preferredNarrativeTrack?
priority
```

## 153. Flexible capacity

Calendar должен поддерживать свободные slots для spontaneous real-life content. План не обязан заполнять 100% времени.

## 154. SeasonalOpportunity

```text
market
culture
date
theme
relevance
artistFit
campaignFit
```

## 155. Market-aware seasonality

Не применять культурные события автоматически ко всем артистам/рынкам.

## 156. PlanningObjective first

```text
PlanningObjective
id
artistId
title
statement
periodStart
periodEnd
scope: ARTIST|CAMPAIGN|RELEASE|EVERGREEN|CUSTOM
campaignId?
releaseId?
priority: PRIMARY|SECONDARY
status: DRAFT|ACTIVE|COMPLETED|CANCELLED|ARCHIVED
successCriteria[]
createdAt
updatedAt
completedAt?
```

Calendar строится от PlanningObjective, current Campaign, Narrative Mix, Evergreen requirements, Production Capacity, Existing Assets и active Experiments. `Monthly Objective` становится default UX preset над period-scoped PlanningObjective, а не отдельной month-specific сущностью.

PlanningObjective выражает operational focus, не заменяет CampaignGoal или RevenueGoal. Metrics могут показывать progress, но completion остаётся human-controlled. В MVP допускается один overlapping PRIMARY artist-level objective плюс optional secondary objectives.

## 157. Calendar Views

```text
Week
Month
```

## 158. Calendar Card

```text
Thumbnail
Song
Pillar / Vertical
Narrative Track
Platform
Mode
Status
```

## 159. AI scheduling

AI предлагает timing/slots; публикация и significant scheduling decisions остаются human-controlled.

# ЧАСТЬ XIV. PRODUCTION SYSTEM

## 160. ProductionCapabilityProfile

```text
cameras[]
phones[]
lenses[]
microphones[]
audioInterfaces[]
lights[]
stands[]
backgrounds[]
software[]
locations[]
crewCapabilities[]
```

## 161. EquipmentItem

```text
type
brand
model
owned
available
qualityTier
strengths[]
limitations[]
```

## 162. Capability-aware Production Agent

Production idea должна учитывать реальное equipment/location/budget/skill level и предлагать feasible fallback.

## 163. ProductionIntent

```text
AUTHENTIC
CASUAL
POLISHED
CINEMATIC
EXPERIMENTAL
```

## 164. ShootSession

```text
id
date
location
songs
setup
wardrobe
lighting
camera
identityVersionId
status
```

## 165. Shot

```text
contentUnitId
plannedOrder
cameraSetup
framing
audioUsage
identityRequirements
instructions
status
```

## 166. Shot statuses

```text
NOT_STARTED
IN_PROGRESS
SHOT
SKIPPED
```

Shot отражает planning/execution state. Quality/selection принадлежат Take. `SHOT` означает, что существует как минимум один captured/confirmed Take; это не оценка качества.

### 166A. Take

```text
id
shootSessionId
shotId
takeNumber
startedAt?
endedAt?
status: CAPTURED|GOOD|BAD|SELECTED
captureSource: ON_SET|INGEST_INFERRED|MANUAL
notes?
createdAt
updatedAt
```

Один Shot может иметь много Takes. По умолчанию не более одного Take имеет статус `SELECTED` на Shot. Selection history аудируется; смена selection не удаляет предыдущие Takes.

### 166B. TakeAsset

```text
takeId
assetId
role: PRIMARY_VIDEO|SECONDARY_VIDEO|AUDIO|PHOTO|OTHER
confidence?
confirmedByHuman
```

Smart Ingest может создавать `INGEST_INFERRED` candidates, но uncertainty/confidence должны быть видимы; недостаточно уверенные mappings требуют human confirmation.

## 167. On-Set route

`/shoots/:id/on-set` — mobile-first PWA с крупными controls, current shot, audio segment, identity constraints, take counter.

## 168. On-Set controls

```text
START TAKE
GOOD
BAD
SELECT
NEXT
```

`GOOD`, `BAD`, `SELECT` применяются к текущему Take, а не к Shot. START TAKE создаёт idempotent local Take record и должен работать offline-first.

## 169. On-Set identity constraints

Показывать не более 3–5 critical constraints: backdrop/wardrobe/light/anchor/avoid, чтобы не перегружать съёмку.

## 170. Smart Media Ingest

После batch import система предлагает mapping файлов к shots/content/takes с confidence.

## 171. Smart Ingest Signals

```text
recordedAt
creationTimestamp
duration
orientation
device
shoot window
shot schedule
transcript
audio similarity
visual similarity
```

## 172. Suggested Mapping

Human confirmation: Accept / Change / Ignore. Не скрывать confidence.

## 173. Auto Group Takes

Группировать по timestamps, visual context, audio, transcript и shoot context.

## 174. Device Time Offset

Поддержать per-device offset и сохранение настройки для следующих imports.

## 175. TranscriptionProvider

```text
transcribe()
detectLanguage()
getTimestamps()
diarize()
```

## 176. Speech vs Singing

Speech transcription — primary для speech; singing identification использует audio segment/similarity/timestamps/shot context, transcript только secondary signal.

## 177. Voice Note Pipeline

```text
Voice Note → Speech Transcription → Idea/Story Extraction → Candidate Knowledge → Optional Content Angle
```

## 178. Asset

```text
id
artistId
songId?
shootSessionId?
type
storageKey
createdAt
recordedAt
duration?
width?
height?
orientation?
device?
metadata
```

## 179. Asset Types

```text
VIDEO
AUDIO
PHOTO
VOICE_NOTE
ARTWORK
DOCUMENT
TRANSCRIPT
```

## 180. AssetContentType

```text
SPEECH
SINGING
MIXED
INSTRUMENTAL
UNKNOWN
```

## 181. AssetOrigin

```text
ORIGINAL_ARTIST
COMMISSIONED
LICENSED_STOCK
CURATED_REFERENCE
GENERATED
```

## 182. RightsStatus

```text
OWNED
LICENSED
PUBLIC_LICENSE
PERMISSION_GRANTED
REFERENCE_ONLY
UNKNOWN
```

## 183. AssetRights

```text
creator
sourceUrl
license
acquiredAt
expiresAt?
commercialUse
modificationAllowed
attributionRequired
proofAssetId?
```

## 184. Credit ≠ License

Наличие credit/`I do not own` не переводит Asset из UNKNOWN/REFERENCE_ONLY в publishable.

## 185. ExternalAssetSource

Registry для providers типа stock/video/font/template libraries. Сохранять license metadata и freshness, не hardcode конкретные сервисы.

## 186. AssetAcquisitionPlan

```text
requirement
preferredOrigin
budget
rightsRequirement
fallbacks[]
```

## 187. Content Lineage

```text
Identity Version → Era → Song → Audio Segment → Content Angle → Shoot → Raw Asset → Take → Selected Take → Edit → Content Unit → Publication → Metrics
```

## 188. AssetDerivation

Canonical media provenance строится через typed derivation edges:

```text
AssetDerivation
id
childAssetId
parentAssetId
role: PRIMARY_SOURCE|SECONDARY_SOURCE|AUDIO_SOURCE|VISUAL_SOURCE|REFERENCE_SOURCE
derivationType: TRIM|CROP|COLOR_GRADE|CAPTIONED|MIXED|EXPORT|REMIX
sequence?
metadata?
createdAt
```

Derived Asset может иметь one-or-many parents. Cycles запрещены. Rights evaluation композирует ограничения всех publish-relevant parents. `parentAssetId` может временно существовать как compatibility projection для single-parent derivatives, но не является canonical truth v1.4. Reference-only/inspiration assets не становятся publish-source parents автоматически. Lineage должна обходиться в обе стороны.

## 189. Asset Atomization

Long-form/live/source asset может порождать structured derivative plan для full performances, shorts, lyric clips, spoken moments, recap и других outputs.

## 190. RepurposingPlan

```text
sourceAssetId
derivatives[]
targetPlatforms[]
priority
status
```

## 191. Production Economics

Опционально считать production cost / usable derived assets и сравнивать scenarios, не сводя artistic value только к цене.

# ЧАСТЬ XV. PROFILE READINESS & DISTRIBUTION OPERATIONS

## 192. ProfileReadiness

```text
identityEstablished
profilePhotoReady
bioReady
primaryCTAReady
linkDestinationReady
representativeContentCount
pinnedContentReady
activeCampaignVisible
status
```

## 193. Readiness statuses

```text
NOT_READY
MINIMUM_READY
READY
OPTIMIZED
```

## 194. StarterContentPack

Перед cold acquisition profile должен объяснять, кто артист: минимальный набор roles может включать ARTIST_INTRO, PERFORMANCE, SONG_DISCOVERY, PERSONALITY, VISUAL_IDENTITY, BTS. Число 9 не hardcoded.

## 195. ProfileContentAudit

```text
KEEP
ARCHIVE
REPACKAGE
PIN
IGNORE
```

## 196. FeedPreview

Опциональный visual gut-check. Не блокирует публикацию и не делает идеально выстроенный grid главным KPI.

## 197. Publication ≠ ContentUnit

Один Content Unit может иметь несколько platform-specific Publications.

## 198. Publication

```text
id
contentUnitId
platform
platformContentId?
publishedAt?
url?
status
captionVersion
audioUsage
```

## 199. Platform Adaptation

Один master concept может иметь разные hook, caption, crop, duration, thumbnail/title, CTA, audio и metadata для разных платформ.

## 200. PublishingMode

```text
MANUAL_NATIVE
NATIVE_SCHEDULED
THIRD_PARTY_SCHEDULED
API_PUBLISHED
```

## 201. PublishingProvider

Provider abstraction; domain не зависит от Later/Buffer/Sendible или любой конкретной SaaS.

## 202. Human-aware automation

Scheduling помогает consistency, но OS сохраняет spontaneous/flex content и не превращает артиста в fully automated brand.

### 202A. OperationalAction

```text
id
artistId
sourceDomain
sourceEntityType
sourceEntityId
platform?
title
description?
actionType
status: OPEN|IN_PROGRESS|BLOCKED|DONE|SKIPPED|EXPIRED
priority: LOW|NORMAL|HIGH|URGENT
dueAt?
notBefore?
executionMode: MANUAL_NATIVE|EXTERNAL|API_ASSISTED|SYSTEM_CHECK
externalUrl?
completedAt?
evidenceRef?
createdAt
updatedAt
```

OperationalAction — shared primitive для human/external operational work (`update bio`, `submit pitch`, `schedule natively`, `verify profile`). Это не generic task-management subsystem. Source domain владеет business truth; OperationalAction владеет только completion state. `Job` остаётся machine/background work, `Decision` — strategic commitment. DONE требует user confirmation или verifiable provider evidence, когда действие происходит вне OS.

# ЧАСТЬ XVI. LINK ROUTING & OWNED MEDIA

## 203. Link Routing Engine

Campaign-aware управление destinations вместо ручного хаотичного изменения bio link.

## 204. LinkHub

```text
artistId
campaignId?
primaryDestination
destinations[]
analyticsConfig
activeFrom
activeUntil?
```

## 205. LinkDestination types

```text
STREAM
PRE_SAVE
VIDEO
TICKET
MERCH
WEBSITE
MEMBERSHIP
SOCIAL
CUSTOM
```

## 206. Time-aware CTA

Campaign может менять primary destination по этапам: pre-save → release stream → video/performance → evergreen.

## 207. Direct vs Smartlink vs Website

OS выбирает routing mode по objective и capabilities; smartlink не считается обязательным.

## 208. Owned Media Engine

Artist Website — controlled owned destination, применяющий Identity, Release Story, Music, Video, Commerce и Audience Capture.

## 209. WebExperience

```text
id
artistId
identityVersionId
eraIdentityId?
campaignId?
primaryObjective
status
publishedVersionId?
```

## 210. PrimaryWebObjective

```text
RELEASE
FOLLOW
EMAIL_CAPTURE
TICKET
MERCH
ARTIST_INTRO
PRE_SAVE
STREAM
```

## 211. WebSection

```text
HERO
RELEASE
ARTIST_INTRO
STORY
MUSIC
VIDEO
BTS
SHOWS
MERCH
PRESS
MAILING_LIST
SOCIAL
CONTACT
CUSTOM
```

## 212. WebStory

Campaign/album/song narrative fragments + assets + BTS + quotes + music refs. Mystique Guard определяет, что из internal canon можно раскрывать.

## 213. Homepage heuristic

Long-scroll homepage и `everything on homepage` рассматриваются как testable IA hypothesis, а не universal rule.

## 214. AudienceCaptureIntegration

Собственный CRM не входит в v1.4. OS хранит provider/form/campaign и агрегированные conversion metrics; PII остаётся у специализированного provider, если не подключён явный CRM scope.

## 215. Web Analytics

```text
page_view
scroll_depth
section_view
cta_click
music_click
social_click
email_signup
merch_click
ticket_click
```

## 216. Cross-surface lineage

Asset/ContentUnit может использоваться в Reel, website hero, EPK, Brand Book и campaign landing. Все usages должны быть traceable.

# ЧАСТЬ XVII. PLATFORM CAPABILITY REGISTRY

## 217. PlatformCapability

```text
platform
region?
accountType?
capability
requirement
validFrom
validUntil?
sourceId
lastVerifiedAt
```

## 218. Capability examples

```text
LIVE
WEBSITE_LINK
GIFTS
MONETIZATION
DIRECT_POSTING
SCHEDULING
PLAYLISTS
EDITORIAL_PITCH
VIDEO_PITCH
MERCH
EVENTS
```

## 219. No hardcoded thresholds

Follower/subscriber thresholds и platform eligibility не должны жить как вечные `if >= 1000`. Они загружаются/обновляются как capability knowledge.

## 220. PlatformAccountProfile

```text
platform
accountType
capabilities[]
restrictions[]
musicRightsMode
advertisingCapabilities[]
```

## 221. PlatformAssetRequirement

Хранит актуальные размеры/форматы/ограничения platform assets с source/freshness.

## 222. Platform Rules freshness

Если правило устарело или не проверено, UI не должен представлять его как факт.

# ЧАСТЬ XVIII. DSP INTELLIGENCE

## 223. DSP domain

Отдельный слой Distribution Intelligence для Spotify/Apple Music/YouTube Music и других DSP, не смешанный с social metrics.

## 224. DSPProfile

```text
platform
artistId
claimed
profileUrl
bioStatus
imageStatus
socialLinksStatus
eventsStatus
merchStatus
artistPickStatus?
playlistStatus?
videoStatus?
readiness
```

## 225. DSP Profile Identity

Profile assets/bio/merch/video должны ссылаться на active Identity/Era и проходить Identity Guard там, где это полезно.

## 226. DSPReleasePlan

```text
releaseId
platform
profileTasks[]
pitchTasks[]
visualTasks[]
playlistTasks[]
campaignTools[]
launchTasks[]
postLaunchTasks[]
```

## 227. DSPOpportunity

```text
type
eligibility
deadline?
status
sourceId
lastVerifiedAt
```

## 228. DSPOpportunity types

```text
EDITORIAL_PITCH
RELEASE_RADAR
ARTIST_PICK
COUNTDOWN
VIDEO_PITCH
DISCOVERY_MODE
SHOWCASE
MARQUEE
ARTIST_PLAYLIST
```

## 229. EditorialPitch

```text
platform
songId
releaseId
status
submittedAt?
deadline?
genre
mood
culture
instruments
story
marketingPlan
outcome?
```

## 230. Release Readiness

Unified checklist master/metadata/artwork/profile/pitch/content/link routing/website/video/press hooks. Specific platform deadline приходит из Capability Registry.

## 231. Release Momentum Windows

```text
PRE_RELEASE
DAY_0
DAY_1_7
DAY_8_30
DAY_31_90
CATALOG
```

## 232. No 24-hour destiny rule

Launch burst полезен как coordinated campaign, но первые 24 часа не считаются deterministic fate of release.

## 233. LaunchActivationPlan

```text
releaseId
channels[]
contentUnits[]
pressActions[]
adsExtensionPoints[]
emailActions[]
creatorActions[]
```

## 234. Source of Streams

```text
PROFILE
LISTENER_PLAYLIST
EDITORIAL
ALGORITHMIC
RADIO
AUTOPLAY
SEARCH
OTHER
```

## 235. DiscoveryChannelPerformance

Хранить distribution of streams/listeners по source categories, где platform/export это позволяет.

## 236. ReleaseCadencePlan

```text
HIGH_FREQUENCY
MONTHLY
CAMPAIGN_LED
ERA_LED
CUSTOM
```

## 237. Cadence as experiment

Monthly single / remix-after-two-weeks и другие patterns не hardcoded. Сравнивать quality, audience fatigue, campaign overlap, budget, content capacity и catalog lift.

## 238. ArtistPlaylist

```text
purpose: INFLUENCES|MOOD|ERA|GENRE|CAMPAIGN
identityVersionId
playlistId
status
```

## 239. PlaylistOpportunity

```text
platform
playlistName
playlistUrl
curator?
genreFit
audienceFit
submissionMethod
status
source
```

## 240. PlaylistRisk

```text
NORMAL
UNKNOWN
SUSPICIOUS
AVOID
```

## 241. No playlist hacks as facts

`one song per artist`, `own track top-10`, `repeat artists cause de-ranking` и подобные closed-algorithm claims остаются unverified hypotheses, если нет credible evidence.

## 242. DSP Video

```text
platform
songId
type: MUSIC_VIDEO|LIVE_PERFORMANCE|STUDIO_SESSION|COVER
pitchStatus
publicationStatus
```

## 243. Streaming Revenue

Не умножать streams на фиксированный universal rate. Импортировать реальные royalty statements и вычислять effective historical rate отдельно.

## 244. DSPRevenueSnapshot

```text
platform
period
streams
reportedRoyalty
currency
effectiveRevenuePer1000Streams
```

# ЧАСТЬ XIX. ORGANIC GROWTH & MARKET INTELLIGENCE

## 245. Growth & Distribution Intelligence

Органический рост, search, LIVE, creator collaboration, warm network, market testing и growth experiments — отдельный bounded context от Advertising.

## 246. Warm Network Activation

До cold acquisition OS может предложить активировать существующую сеть, но не требует массово писать 100% знакомых. Поддержать segments CLOSE_SUPPORTERS/FRIENDS/PROFESSIONAL_NETWORK/MUSIC_CONTACTS/LOCAL_COMMUNITY/PAST_FANS.

## 247. AudienceSource

```text
WARM_NETWORK
ORGANIC_DISCOVERY
PAID
COLLABORATION
SEARCH
LIVE
DSP
OWNED_MEDIA
```

## 248. Posting Cadence

Frequency является configurable strategy/experiment variable, а не universal platform law.

## 249. SearchIntent

```text
primaryQuery
secondaryQueries[]
entities[]
song?
artist
genre
referenceArtists[]
topic
```

## 250. Search Opportunity

Если platform предоставляет official search insights, сохранять query/demand/content gap/relevance. Не строить hidden keyword hacks как core feature.

## 251. No off-screen keyword hack

Скрытые off-screen keywords не входят в recommended platform strategy без official evidence; могут существовать только как historical/research claim.

## 252. MarketOpportunity

```text
country
region?
language
songId?
genre?
signals
confidence
```

## 253. Market signals

```text
organicListeners
followerGrowth
engagement
streamGrowth
playlistPresence
adPerformanceExtension
searchInterest
creatorInteractions
```

## 254. Market decision

OS показывает dimensions и evidence, а не единый magic score. География не выбирается только по cheap acquisition.

## 255. Geo Experiment

Сравнивать markets по relevant metrics: organic response, follower quality, music conversion, retention и cost signals после появления Advertising module.

## 256. LiveSession

```text
platform
scheduledAt
duration
format
setlist[]
goal
accessMode
ticketPrice?
status
```

## 257. Live formats

```text
JAM
ACOUSTIC
REQUESTS
BTS
Q_AND_A
RELEASE
REHEARSAL
```

## 258. Live objectives

```text
GROWTH
COMMUNITY
REVENUE
RELEASE
MEMBERSHIP
```

## 259. Live access modes

```text
FREE
PAID
DONATION
MEMBERSHIP_INCLUDED
```

## 260. Live Analytics

Поддержать доступные platform metrics: unique viewers, peak concurrent, avg watch, new followers, comments, gifts/revenue, profile visits.

## 261. No fixed LIVE test-wave claim

Claims типа `первые 50–100 зрителей решают distribution` сохраняются как practitioner hypothesis до подтверждения.

## 262. CreatorCollaboration

```text
creatorId
type: UGC|INFLUENCER|MUSICIAN|PRODUCER
campaignId
brief
assetIds[]
cost?
usageRights
metrics
status
```

## 263. Creator pricing

Не хранить исторические course rates как truth. Использовать actual quotes и rights/deliverables.

# ЧАСТЬ XX. BUSINESS & FAN VALUE

## 264. Artist Business & Fan Value Engine

Поддерживает strategic monetization и unit economics, но не становится бухгалтерией/налоговой системой.

## 265. RevenueGoal

```text
period
targetGrossRevenue
targetNetRevenue?
targetArtistTakeHome?
currency
deadline
assumptions[]
```

## 266. Reverse planning

Система может строить несколько revenue scenarios. `1000 fans × $100/year` — scenario/heuristic, не law.

## 267. RevenuePortfolio

```text
STREAMING
LIVE_SHOWS
LIVE_STREAMS
MERCH
MEMBERSHIPS
PHYSICAL_MUSIC
DIGITAL_PRODUCTS
SYNC
BRAND_PARTNERSHIPS
CREATOR_SERVICES
OTHER
```

## 268. Financial terminology

Разделять gross revenue, fees, COGS, fulfillment, marketing/production cost, contribution profit, net operating result. Не называть revenue зарплатой/прибылью.

## 269. FanValueCohort

```text
CASUAL
ENGAGED
HIGH_AFFINITY
PAYING
REPEAT_BUYER
MEMBER
```

## 270. Fan Relationship funnel

```text
DISCOVERY → FOLLOWER → ENGAGED → HIGH_AFFINITY → FIRST_PURCHASE → REPEAT_PURCHASE → MEMBER / ADVOCATE
```

## 271. Privacy boundary

По умолчанию хранить aggregated fan data. Person-level tracking подключается только при явной CRM/ecommerce integration и privacy scope.

## 272. Offer

```text
type
audienceSegment
valueProposition
price
availability
campaignId?
identityVersionId
status
```

## 273. Offer types

```text
MERCH
MEMBERSHIP
LIVE
TICKET
PHYSICAL_MUSIC
DIGITAL_PRODUCT
```

## 274. Offer Fit

Explainable dimensions: Audience Fit, Identity Fit, Campaign Fit, Production Cost, Margin, Operational Load. Без magic score.

## 275. MerchOffer

```text
songId?
campaignId?
title
productType
designAssetIds[]
provider
unitCost
retailPrice
estimatedFees
estimatedMargin
availabilityMode
launchAt
endAt?
status
```

## 276. AvailabilityMode

```text
ALWAYS_AVAILABLE
TRUE_QUANTITY_LIMIT
TRUE_TIME_LIMIT
PREORDER_WINDOW
MADE_TO_ORDER
```

## 277. UnitEconomics

```text
price
productionCost
fulfillmentCost
platformFee
paymentFee
estimatedReturnCost
grossMargin
contributionMargin
```

## 278. Merch identity

Merch concept может использовать lyric, Era colors, Typography, Symbolic Anchors, artwork fragments. Merch является Content Vertical/Offer и проходит rights/identity checks.

## 279. MembershipProgram

```text
artistId
provider
tiers[]
status
```

## 280. MembershipTier

```text
name
price
billingPeriod
benefits[]
capacity?
accessRules[]
```

## 281. MembershipBenefit

```text
type
deliveryCost
artistTimeEstimate
scalable
```

## 282. Membership Analytics

```text
MRR
ActiveMembers
NewMembers
Churn
Retention
ARPU
TierDistribution
UpgradeRate
```

## 283. Live monetization

LiveSession может хранить ticket/gift/merch/replay revenue. Бесплатный LIVE не считается ошибкой, если objective = growth/community/release.

## 284. RevenueEvent

```text
source
offerId?
campaignId?
contentUnitId?
publicationId?
grossAmount
fees
netAmount
currency
occurredAt
attributionConfidence
```

## 285. AttributionConfidence

```text
DIRECT
PROBABLE
UNKNOWN
```

## 286. No full accounting

Не строить taxes, payroll, depreciation, double-entry bookkeeping в v1.4.

# ЧАСТЬ XXI. ANALYTICS NORMALIZATION

## 287. Canonical Metrics

Внутренняя normalized schema отделяет platform-specific fields от общих concepts. Не существующая метрика = NULL, не 0.

## 288. MetricSnapshot

```text
publicationId
platform
observedAt
views?
likes?
comments?
shares?
saves?
watchTime?
averageWatchTime?
completionRate?
profileVisits?
followersGained?
linkClicks?
```

## 289. Preferred snapshots

При возможности: 1h, 6h, 24h, 72h, 7d, 30d. Реальная platform availability имеет приоритет.

## 290. Derived metrics

```text
Engagement Rate
Share Rate
Save Rate
Follow Conversion
Profile Conversion
Music Click Conversion
Offer Conversion
```

## 291. No cross-platform raw ranking

Не сравнивать views или engagement raw между платформами без platform-specific baseline/context.

## 292. Baselines

Строить по platform + pillar/format + period, при необходимости song/narrative/market scope.

## 293. Median first

Для noisy datasets показывать median рядом с average; поддерживать percentiles.

## 294. Outlier Detection

```text
NORMAL
HIGH_OUTLIER
VIRAL_OUTLIER
```

## 295. Virality bias guard

Один viral outlier не становится best practice. Учитывать sample size, variance, median, outliers, confidence.

## 296. Narrative analytics

Сравнивать narrative tracks отдельно от pillars и formats.

## 297. Hook analytics

Сравнивать hook pattern + emotional mechanism + platform + audience scope.

## 298. Segment analytics

Сравнивать SongSegments по executions, не делать вывод после единичного use.

## 299. Market analytics

Сравнивать response/retention/conversion по markets; не оптимизировать только под cheap reach.

## 300. Fan value analytics

Audience size и audience depth — отдельные axes. Большой follower count не означает high fan value.

# ЧАСТЬ XXII. INSIGHT, HYPOTHESIS, EXPERIMENT, LEARNING

## 301. Insight

```text
statement
scope
evidence
sampleSize
confidence
createdAt
status
```

## 302. Insight wording

Формулировка должна быть ограниченной evidence: `среди последних 8... median выше`, а не `это лучший формат`.

## 303. Hypothesis

```text
statement
sourceInsightIds
testableVariable
targetMetric
status
```

## 304. Experiment

```text
hypothesisId
control
variant
primaryMetric
secondaryMetrics
minimumObservations
startAt
endAt
status
```

## 305. Experiment principle

Менять преимущественно одну важную переменную там, где это возможно; creative portfolio tests могут быть multi-factor, но помечаются соответствующим образом.

## 306. Experiment decisions

```text
KEEP
RETEST
REJECT
INCONCLUSIVE
```

## 307. Learning states

```text
CANDIDATE
TESTING
VALIDATED
STALE
DEPRECATED
```

## 308. Learning scopes

```text
ARTIST_GLOBAL
PLATFORM
SONG
PILLAR
FORMAT
AUDIENCE
CAMPAIGN
AUDIO_SEGMENT
NARRATIVE
MARKET
BUSINESS
IDENTITY
```

## 309. Learning confidence

```text
LOW
MEDIUM
HIGH
```

## 310. Confidence explanation

Показывать sample size, confirmations, contradictions, age/freshness.

## 311. Time decay

Old evidence не удаляется. Weight может снижаться, а validated learning переходить в STALE и требовать retest.

## 312. Explore / Exploit

```text
EXPLOIT
ADJACENT_TEST
EXPLORATION
```

## 313. 70/20/10

Допустимый стартовый portfolio heuristic, но не universal best practice.

## 314. Identity learning threshold

Identity changes требуют более сильного evidence и human approval, чем tactical content learnings.

## 315. Identity change pipeline

```text
Performance Signal → Insight → Identity Hypothesis → Repeated Tests → Evidence → Human Review → Era Evolution / Identity Update
```

# ЧАСТЬ XXIII. DECISION MEMORY

## 316. Decision Entity

```text
id
title
decision
reason
evidenceIds[]
experimentIds[]
scope
createdAt
reviewAt?
status
```

## 317. Decision status

```text
ACTIVE
UNDER_REVIEW
REVERSED
EXPIRED
```

## 318. Why decisions matter

System memory должна хранить не только `что мы знаем`, но и `почему мы решили действовать именно так`.

## 319. Weekly Review

```text
What happened
What worked
What underperformed
What we learned
What remains uncertain
Fatigue signals
Experiments
Narrative coverage
Market signals
Recommended next actions
Production requirements
```

## 320. Weekly labels

```text
FACT
OBSERVATION
HYPOTHESIS
RECOMMENDATION
```

## 321. Identity Review

Identity review делать реже (monthly/quarterly or event-driven), чтобы не rebrand по недельной волатильности.

# ЧАСТЬ XXIV. AI / AGENT ARCHITECTURE

## 322. No agent swarm

MVP использует ограниченное число physical agents; logical roles могут быть шире.

## 323. Physical Agents

```text
Orchestrator
Research Agent
Strategy Agent
Production Agent
Analytics Agent
Brand / Identity Guard
```

## 324. Orchestrator

Определяет task class, required context, tools, specialist, job mode и approval policy.

## 325. Research Agent

Работает с current sources, platform knowledge, market/reference research. Output structured: Finding/Evidence/Source/Date/Authority/Confidence/Application.

## 326. Strategy Agent

Отвечает, что стоит создать/проверить и зачем, используя Identity Capsule, Song, Campaign, Audience, Market и Validated Learnings.

## 327. Production Agent

Превращает approved Angle в feasible production package с учётом equipment/location/identity/rights constraints.

## 328. Analytics Agent

Работает только со structured metrics/evidence и не придумывает missing data.

## 329. Brand/Identity Guard

Проверяет tone, clichés, repetition, factual claims, originality, identity alignment, mystique, era, rights warnings.

## 330. Agent Permissions

Research: read web/knowledge; Strategy: read knowledge/analytics/create drafts; Production: read assets/create plans; Analytics: read metrics/create insights. Publish/Delete/Spend запрещены без explicit application approval.

## 331. AgentConfiguration

```text
agentType
model
promptVersion
guardVersion
reasoningLevel
tools
retrievalConfig
structuredOutputSchema
status
```

## 332. Config lifecycle

```text
DRAFT → CANARY → STABLE → RETIRED
```

## 333. Automatic rollback

Разрешён при structured output/tool/eval/latency/cost regression. Subjective creative quality требует human review.

## 334. AgentRun

```text
id
workflow
agent
configurationVersion
startedAt
finishedAt
status
tokenUsage
cost
latency
```

## 335. Prompt Registry

```text
ai/prompts/
ai/schemas/
ai/guardrails/
ai/evals/
ai/configurations/
```

## 336. AI Evals

Golden dataset включает artist-aligned/generic ideas, tone, grounding, identity/mystique compliance, analytics conclusions, novelty и actionability.

## 337. Model routing

High reasoning для research synthesis/weekly strategy/complex analytics; cheaper/faster models для tagging/classification/metadata/guards, если quality достаточна.

## 338. Agent budgets

```text
maxTurns
maxToolCalls
maxTokens
timeout
costLimit
```

# ЧАСТЬ XXIV-B. AI MATURITY, COST & PRODUCT SCALING

## 339. Single Artist First

Первую production-версию оптимизировать под одного артиста. Это позволяет глубже проработать identity, knowledge, learning и workflows до появления team/SaaS complexity.

## 340. Future-ready artist scope

Ключевые domain entities должны иметь `artistId` там, где это логически необходимо, чтобы будущая multi-artist модель не требовала разрушительной миграции. Не строить organizations/billing/enterprise roles заранее.

## 341. Cold Start

При малом количестве собственных данных Strategy опирается преимущественно на Artist Identity, Song Context, primary-source platform knowledge и exploration. Generic best practices не должны маскироваться под personal learnings.

## 342. Warm State

По мере накопления публикаций и экспериментов увеличивать вес own analytics, own audience/market signals и tested hypotheses.

## 343. Mature State

В зрелом состоянии принцип: `Own validated evidence > generic creator advice`, кроме случаев, когда external platform rule является authoritative/current hard constraint.

## 344. Fine-tuning policy

Fine-tuning не использовать в MVP. Рассматривать только после накопления большого curated corpus approved/rejected outputs, стабильных eval criteria и доказанного преимущества относительно RAG + structured knowledge + configuration/evals.

## 345. AI caching

Кэшировать stable summaries, hot context capsules, platform playbooks, embeddings и другие дорогие deterministic-ish промежуточные результаты с корректной invalidation/versioning.

## 346. Infinite generation protection

Content Factory не должен быть бесконечным генератором вариантов. Ограничивать количество вариантов, retries и similarity; при недостатке evidence выводить `Insufficient evidence` вместо искусственной уверенности.

## 347. UI performance independence

Dashboard, Pipeline, Calendar, Assets и базовые entity pages не должны ожидать AI generation для основной загрузки. Long-running AI/research/media operations выполняются через JobService.

# ЧАСТЬ XXV. JOB ARCHITECTURE

## 348. JobService

```text
enqueue()
cancel()
retry()
status()
```

## 349. Core jobs

```text
TRANSCRIBE_ASSET
ANALYZE_ASSET
GENERATE_EMBEDDINGS
IMPORT_ANALYTICS
REFRESH_PLATFORM_DATA
WEEKLY_REVIEW
RUN_AGENT
GENERATE_PREVIEW
SMART_INGEST
ANALYZE_MOODBOARD
EXTRACT_VISUAL_PATTERNS
GENERATE_BRAND_BOOK
IDENTITY_CHECK
```

## 350. Queue

MVP допускает PostgreSQL-backed queue; QueueProvider должен быть replaceable.

## 351. Idempotency

Каждый background job имеет idempotency key и безопасен к at-least-once delivery.

## 352. Retry

```text
maxAttempts
backoff
retryableErrors
deadLetterState
```

## 353. Progress UI

```text
Queued
Researching
Analyzing
Generating
Quality Check
Done
Failed
```

# ЧАСТЬ XXVI. UX / INFORMATION ARCHITECTURE

## 354. Primary Navigation

```text
Overview
Identity
Songs
Factory
Pipeline
Shoots
Assets
Calendar
Distribution
DSP
Growth
Business
Analytics
Experiments
Knowledge
Decisions
Agents
Settings
```

## 355. Identity routes

```text
/identity
/identity/discovery
/identity/discovery/archetype
/identity/discovery/listening
/identity/discovery/associations
/identity/moodboard
/identity/visual-dna
/identity/narrative
/identity/anchors
/identity/mystique
/identity/verticals
/identity/eras
/identity/brand-book
```

## 356. Core routes

```text
/
/songs
/songs/:id
/factory
/pipeline
/shoots
/shoots/:id
/shoots/:id/on-set
/assets
/assets/:id
/calendar
/distribution
/dsp
/growth
/business
/analytics
/experiments
/knowledge
/knowledge/candidates
/decisions
/agents
/settings
```

## 357. Dashboard question

Overview отвечает: `что сейчас требует внимания?`, а не пытается показать все данные.

## 358. Dashboard blocks

Current Focus, Release/Campaign readiness, Production bottlenecks, Profile/DSP readiness, KPI summary, Narrative/Content balance, Active experiments, Key learning, Upcoming decisions.

## 359. Top Content tabs

```text
Reach
Followers
Shares
Saves
Music Conversion
Fan Value
```

## 360. Identity Dashboard

Current identity version, archetype, active era, emotional territory, visual DNA, anchors, mystique, vertical completeness, Brand Book status.

## 361. Narrative Coverage UI

Показывать Core/Human/Secondary actual vs target и content pillar mix отдельно.

## 362. Pipeline Kanban

```text
Ideas
Approved
To Shoot
Shot
Editing
Review
Ready
Scheduled
Published
```

## 363. Pipeline filters

```text
Song
Campaign
Pillar
Narrative
Mode
Platform
Status
Priority
```

## 364. Bottleneck Intelligence

Например: `11 approved ideas, only 2 shot`; `8 ready, no publication date`; `DSP pitch deadline approaching`.

## 365. Command Palette

⌘K: New Idea, Add Song, Record Voice Note, Start Shoot, Generate Angles, Import Assets, Import Metrics, Create Experiment, Run Weekly Review.

## 366. Low friction

Каждый manual field проверять: можно ли suggest/detect автоматически. Preferred UX = System Suggestion → Accept/Edit.

## 367. Bulk actions

Bulk accept/tag/status move/prepare export/import mapping.

## 368. Empty states

Показывать next-best onboarding action. No metric = `No data available`, не 0.

## 369. Design direction

Dark-first, premium/calm, Linear × Spotify for Artists × Creative Studio как направление, без копирования. Dense only where useful.

## 370. Desktop vs Mobile

Desktop: strategy/knowledge/analytics/pipeline. Mobile: On-Set, Voice Notes, quick capture/approval, lightweight operational checks.

# ЧАСТЬ XXVII. DATA IMPORT & INTEGRATIONS

## 371. CSV Wizard

```text
Upload → Detect → Map → Preview → Validate → Import
```

## 372. Flexible mapping

Не привязываться к одному export schema; mapping хранить как reusable template per source.

## 373. Duplicate detection

Использовать platform + platformContentId + snapshotDate или deterministic import key.

## 374. TikTok adapter

Использовать только official available fields/capabilities; publishing подключать после approval. System remains useful in MANUAL/CSV mode.

## 375. YouTube adapter

Official Data/Analytics/Reporting APIs where available. Search/packaging knowledge separated from hardcoded SEO myths.

## 376. Instagram/Meta adapter

MANUAL/CSV/API modes. Native scheduling/API capability приходит из registry, не из hardcoded assumptions.

## 377. Spotify/DSP imports

Разделять catalog metadata, profile state, source-of-streams/performance exports и royalty statements.

## 378. Creative Tool Registry

CapCut/Prequel/VSCO/Lightroom/etc. могут быть listed tools/capabilities, но не architectural dependencies.

## 379. Presence Registry

```text
canonicalName
displayName
domains[]
handles[]
platformProfiles[]
trademarks[]
verificationRecords[]
```

## 380. SocialHandleRecord

```text
platform
desiredHandle
currentHandle
status: OWNED|AVAILABLE|TAKEN|DISPUTED|UNKNOWN
profileUrl
lastCheckedAt
notes
```

## 381. Trademark tracking

Допускается TrademarkRecord для operational tracking, но не filing/legal advice engine.

## 382. Verification tracking

VerificationRecord хранит platform/status/evidence; исторические course rules типа fixed number of press articles не hardcoded.

# ЧАСТЬ XXVIII. SECURITY, PRIVACY, RIGHTS & PORTABILITY

## 383. Secrets

OpenAI/API keys, OAuth secrets, platform tokens не хранятся во frontend или git.

## 384. Refresh tokens

Encrypted server-side storage.

## 385. Git safety

```text
Never commit .env
tokens
credentials
private exports
```

## 386. Internal Canon privacy

Internal narrative/private artist data не уходит во внешние integrations/Brand Book external mode без необходимости.

## 387. PII minimization

Fan/business integrations по умолчанию используют aggregated metrics; personal data only by explicit feature scope.

## 388. Audit Events

Knowledge changes, identity changes, decisions, agent proposals, approvals, publishing, rule promotion, config changes, rights overrides.

## 389. Knowledge Export

```text
JSON
Markdown
```

## 390. Exportable

Artist Brain, Identity versions, Song Brains, Learnings, Decisions, Experiments, prompts/configs и critical metadata.

## 391. Structured Logs

traceId/jobId/agentRunId correlation для background operations.

# ЧАСТЬ XXIX. PRODUCT TELEMETRY

## 392. OS UX metrics

```text
Time to create Content Unit
Time to plan Shoot
Time to classify 20 Assets
AI suggestion acceptance rate
Manual corrections
Profile readiness time
Release readiness time
```

## 393. AI product metrics

```text
Angle acceptance
Caption acceptance
Edit distance
Retry rate
Agent cost
Latency
Rejection reason
Identity Guard override rate
```

## 394. Smart Ingest KPI

Измерять actual manual organization time before/after; не заявлять заранее arbitrary percentage improvement.

## 395. Identity workflow telemetry

Time to identity activation, number of corrections, moodboard pattern acceptance, Brand Book generation/use.

# ЧАСТЬ XXX. TESTING & QUALITY

## 396. Unit Tests

State machines, metrics, context selection, learning transitions, confidence, AudioUsage, SongSegment, lineage, rights, imports, Identity rules.

## 397. Integration Tests

Repositories, vector retrieval, jobs, transcription, platform adapters, publishing providers, structured AI output, storage.

## 398. Agent Tests

Research cannot publish; Analytics cannot invent metrics; Context excludes unrelated Song Brain; Guard respects Identity/Mystique/Rights.

## 399. Identity Evals

Archetype/emotional/visual/narrative/mystique/era alignment examples, including intentional deviations.

## 400. E2E Core

```text
Create Artist → Identity → Song → PlanningObjective → Campaign/Target → Angle + Narrative attribution → Approve → Execution → Shoot → Take → Smart Ingest → AssetDerivation/Rights → Select Take → Publish → Import Metrics → Insight → Hypothesis → Experiment → Learning → Decision → Next Strategy
```

## 401. E2E Release

```text
Create Song(s) → Release/ReleaseTrack → CampaignTarget(primary=Release) → Release Readiness + OperationalActions → Editorial Opportunity → Content/Link plan → Launch → Post-launch metrics → Source analysis → Learning
```

## 402. Definition of Done

```text
typecheck
lint
unit tests
integration tests where relevant
manual smoke test
no console errors
no broken routes
```

# ЧАСТЬ XXXI. MVP v1.4

## 403. MVP Core

Dashboard, Artist Brain, Songs, Releases, PlanningObjective, Content Factory, Pipeline, Calendar, Shoot Planner, On-Set + Takes, Basic Assets + AssetDerivation, Smart Ingest basic, manual Publication, OperationalActions, CSV Metrics, Analytics, Insights, Experiments, Learnings, Decision Log.

## 404. Identity MVP

Archetype Discovery, Listening Session, Sensory Associations, Moodboard, Visual DNA, Narrative, Symbolic Anchors, Mystique, Typography, Vertical Specs, Identity Version, Web Brand Book.

## 405. Narrative MVP

Narrative Tracks, Beats, Signature Differentiators, Narrative tagging and coverage.

## 406. Music/DSP MVP

Song Segments, AudioUsage, Release/ReleaseTrack, DSP Profile Readiness, Release Readiness, manual DSPOpportunity tracking, source-of-streams CSV/manual where available.

## 407. Distribution MVP

Profile Readiness, platform adaptations, manual/native publishing tracking, Link Routing, basic Website model without full site builder.

## 408. Growth MVP

Warm Network plan, Search Intent metadata, Market Opportunities manual/CSV, Live Sessions, Creator Collaboration tracking. No autonomous paid ads.

## 409. Business MVP

Revenue Goals, Offers, Merch Unit Economics, Membership tracking, Revenue Events manual/import; no accounting/tax.

## 410. AI MVP

Context Assembler, Orchestrator, Research, Strategy, Production, Analytics, Brand/Identity Guard.

## 411. Media MVP

Upload, metadata, transcription, device timestamps/offsets, Take/TakeAsset, assisted linking, take grouping, AssetDerivation lineage, rights status.

# ЧАСТЬ XXXII. NOT MVP / DEFERRED

## 412. Deferred Product Features

```text
native iOS/Android
full autonomous autopost
audio fingerprinting
automatic video editing
team/roles
billing/SaaS multi-tenancy
custom ML models
fine-tuning
advanced computer vision scoring
face recognition
psychological fan profiling
full CRM
full accounting/tax
```

## 413. Advertising boundary

Advertising Intelligence, automated ad creation/spend/scaling/attribution remains separate research stream and future module.

## 414. Publicity boundary

PR/media list, journalist CRM, pitching, earned media attribution, press release automation and relationship management remain separate research stream/future module.

## 415. No autonomous identity changes

Never auto-rebrand, auto-change archetype, protected narrative or non-negotiable identity constraints from engagement data.

# ЧАСТЬ XXXIII. DEVELOPMENT PHASES

## 416. Stage 0 — Architecture Audit

No production code. Inspect repository, reuse, conflicts, target architecture, migration, schema, integrations, credentials, risks.

## 417. Stage 1 — Core Domain Foundation

Artist, Song, Release, ReleaseTrack, Campaign, CampaignTarget, PlanningObjective, Content, Asset, AssetDerivation, Take/TakeAsset, Publication, OperationalAction, Metrics, Experiment, Learning, Decision + identity root/version entities.

## 418. Stage 2 — Core Shell & UI

Navigation, dashboard, songs, pipeline, calendar, shoots, assets.

## 419. Stage 3 — Job Foundation

JobService, job table, worker, retry, idempotency, status UI.

## 420. Stage 4 — Knowledge Foundation

Hot/Warm/Cold, documents, embeddings, retrieval, Candidate Knowledge, ResearchClaim.

## 421. Stage 5 — Artist Identity Foundation

Identity versions, archetype, emotional territory, constraints, summary.

## 422. Stage 6 — Identity Discovery

Listening sessions, transcription, sensory associations, candidate review.

## 423. Stage 7 — Moodboard & Visual DNA

Moodboard, patterns, colors, textures, lighting, art style, typography, visual treatment.

## 424. Stage 8 — Narrative & Mystique

IdentityNarrative, SymbolicAnchors, Mystique/Interpretation, Narrative Tracks/Beats/Differentiators.

## 425. Stage 9 — Identity Outputs

Content Vertical Specs, Brand Book Compiler, external/internal modes.

## 426. Stage 10 — Context Assembler

Identity capsule, song/campaign/learning retrieval, budgets, provenance, debug viewer.

## 427. Stage 11 — AI Core

Orchestrator, Strategy, Production, Research, Guard, Agent Config/Run.

## 428. Stage 12 — Production Intelligence

Transcription/Voice, Shoot Planner, On-Set, Take/TakeAsset, Smart Ingest, AssetDerivation, rights, production capability, atomization basics.

## 429. Stage 13 — Planning & Content Intelligence

PlanningObjective, Song Segments, Hooks, primary/secondary Narrative attribution, Narrative/Content modes, Evergreen, Recurring Series, Novelty/Fatigue.

## 430. Stage 14 — Distribution Foundation

Profile Readiness, OperationalAction, Publication adaptations, Link Routing, Owned Media model, Platform Capability Registry.

## 431. Stage 15 — DSP Intelligence

Release/ReleaseTrack integration, DSP profiles, Release Readiness, opportunities, source-of-streams imports, playlist research, revenue imports.

## 432. Stage 16 — Analytics & Learning

Normalization, baselines, insights, hypotheses, experiments, learnings, time decay, decision feedback.

## 433. Stage 17 — Growth Intelligence

Markets, Live, Search Intent, Creator Collaboration, audience source/cohorts.

## 434. Stage 18 — Business / Fan Value

Offers, Unit Economics, Membership, Revenue Events, business dashboard.

## 435. Stage 19 — Platform Connectors

Prioritize connectors based on actual value/API feasibility, not fixed historical order. Manual/CSV fallback remains first-class.

## 436. Stage 20 — Publishing Automation

Only after domain stability, approval flows and platform feasibility.

## 437. Stage 21 — Advanced Media

Visual similarity, advanced scene detection, best-take suggestions, optional fingerprinting.

# ЧАСТЬ XXXIV. FIRST TASK FOR CODEX — UPDATED STAGE 0

## 438. Codex must inspect repository

package/configuration/src/database/API/UI/tests/storage/build scripts/current AI/integrations. No implementation changes.

## 439. Architecture Audit sections

```text
A Current State
B Reusable Code
C Technical Debt
D Conflicts with MASTER v1.4
E Proposed Target Architecture
F Proposed DB Schema + Relationships
G Artist Identity Architecture
H Narrative Architecture
I Knowledge / Context Architecture
J AI Architecture
K Job Architecture
L Asset / Media / Rights Architecture
M Distribution / Platform Capability Architecture
N DSP Architecture
O Analytics / Learning Architecture
P Growth / Business Extension Architecture
Q Security / Privacy Risks
R Migration Strategy
S Development Sequence
T External Dependencies / Credentials
U Open Questions
```

## 440. DB design requirement

Codex должен явно обосновать relational vs JSONB boundaries; не превращать ArtistIdentity в giant JSON и не создавать десятки таблиц без query/history reason.

## 441. Deviation template

```text
SPEC REQUIREMENT
CURRENT STATE / CONFLICT
PROPOSED SOLUTION
RATIONALE
RISK
```

## 442. Challenge the spec

Codex обязан сигнализировать, если requirement технически ошибочен, устарел, конфликтует с repository или слишком дорог. Но не имеет права молча менять направление.

## 443. Stop after audit

После Stage 0 Codex останавливается. Stage 1 начинается только после review Architecture Audit.

# ЧАСТЬ XXXV. RESEARCH BOUNDARY AFTER v1.4

## 444. Next Research Stream A — Advertising

```text
Meta Ads
TikTok Ads
YouTube Ads
DSP paid tools
Creative testing
Targeting
Budget allocation
Scaling
Attribution
Retargeting
Audience quality
Paid growth experiments
```

## 445. Future Advertising domain

Ожидаемый bounded context: `Advertising Intelligence Engine`, но его entities/automation не считаются нормативными до отдельного research synthesis.

## 446. Next Research Stream B — Publicity / PR

```text
Press strategy
Media outlets
Journalists
Pitching
Premieres
Interviews
Press releases
EPK
Regional PR
Press evidence
Earned coverage
```

## 447. Future Publicity domain

Ожидаемый bounded context: `Publicity & PR Engine`. Не смешивать с Advertising: paid distribution и earned exposure имеют разные entities, economics и evidence.

## 448. Campaign extension points

Release Campaign уже должен позволять будущие references на AdvertisingCampaign/PublicityCampaign, но без premature schema деталей.

# ЧАСТЬ XXXVI. SUCCESS CRITERIA

## 449. MVP functional success

Пользователь может пройти полный loop Identity → Song → Content → Production → Publication → Metrics → Insight → Experiment → Learning → Decision → improved Strategy.

## 450. Identity success

Output ощущается как система конкретного артиста, а не generic musician brand template.

## 451. Content success

Idea специфична для артиста/song/audience/identity/production context и имеет rationale/learning value.

## 452. Production success

AI предлагает реально снимаемые идеи с доступным equipment/location и понятными identity/rights constraints.

## 453. Distribution success

Система знает, готов ли profile/release, куда ведёт CTA, какие platform capabilities актуальны и какие задачи просрочены.

## 454. Analytics success

```text
Что произошло?
На каких данных?
Сколько наблюдений?
Насколько уверены?
Какие alternative explanations?
Что проверить дальше?
```

## 455. Learning success

Own validated evidence постепенно получает больший вес, чем generic creator advice, сохраняя exploration и право артиста на creative exception.

## 456. Business success

Система показывает устойчивость fan value/offers/unit economics без обещаний фиксированного дохода и без превращения продукта в бухгалтерию.

## 457. Final product principle

Artist OS должна максимизировать не количество произведённого контента, а то, **насколько лучше каждое следующее творческое и операционное решение становится благодаря всей предыдущей истории артиста**.

# ЧАСТЬ XXXVII. CODEX GLOBAL RULES

## 458. Understand before code

Перед крупной задачей Codex читает related architecture и existing implementation.

## 459. Extend over rewrite

Предпочитать extension существующего рабочего кода вместо переписывания без причины.

## 460. No destructive actions

Без explicit permission запрещены reset DB, delete directories, destructive migrations, удаление работающих features.

## 461. Risky migration

Перед risky migration: backup plan, migration plan, rollback plan.

## 462. Secrets

Никогда не выводить secrets в commits, console, UI или docs.

## 463. Completion Report

```text
Implemented
Files Changed
Architecture Decisions
Tests
Known Limitations
Technical Debt
Next Stage
```

## 464. DoD

Код не готов только потому, что компилируется: typecheck, lint, relevant tests, smoke test, no console errors, no broken routes.

# ФИНАЛЬНАЯ ЦЕЛЬ ПРОЕКТА

Через длительное использование Artist OS должна уметь объяснить артисту не только, **что публиковать**, но и:

- кем он является как артист в текущей identity/era;
- какую долгосрочную narrative он сейчас рассказывает;
- какие части песен и hooks работают для каких задач;
- какие production patterns устойчивы, а какие устали;
- какие профили, DSP и owned surfaces готовы к следующему campaign;
- какие рынки и audience cohorts проявляют реальный интерес;
- какие offers создают fan value без разрушения доверия;
- какие выводы подтверждены, какие являются гипотезами, а какие пришли только из внешних курсов;
- почему система рекомендует следующий шаг;
- чему следующий шаг позволит научиться.

```text
AUTHENTICITY
+ IDENTITY COHERENCE
+ CREATIVE EVOLUTION
+ OPERATIONAL DISCIPLINE
+ EVIDENCE
+ EXPERIMENTATION
+ HUMAN DECISION
```

Это является целевой архитектурой **Artist OS v1.4**.


---

## v1.4 Freeze Note

MASTER v1.4 incorporates only the architecture delta approved through ACP-001…ACP-006 and companion contracts AR-001…AR-062. Existing numbered sections remain stable to preserve traceability from Full Product Specs and Engineering contracts. New architecture additions use letter-suffixed section identifiers where necessary instead of renumbering legacy requirements.

The freeze becomes normative when the v1.4 freeze PR is human-approved and merged into `main`.
