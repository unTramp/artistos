import { describe, expect, it } from "vitest";
import { ContentAngleContextAssembler, type ContentAngleContextRequest, type ContentAngleContextSourceData } from "./context-assembler";

const request = (overrides: Partial<ContentAngleContextRequest> = {}): ContentAngleContextRequest => ({
  artistId: "artist-1",
  explicitRequest: "Generate story-led angles for this song without hype.",
  songId: "song-1",
  platformTargets: ["INSTAGRAM_REELS"],
  budget: { maxChunks: 8, maxTokens: 5000, maxExamples: 4, maxLearnings: 4 },
  ...overrides
});

const sources = (): ContentAngleContextSourceData => ({
  identity: {
    identityId: "identity-1",
    activeVersionId: "identity-version-2",
    versionNumber: 2,
    label: "Open / emotional",
    eraId: "era-1",
    eraName: "Quiet performance era"
  },
  song: {
    id: "song-1",
    title: "Example Song",
    genre: "Pop",
    mood: "Reflective",
    language: "en",
    story: "A real story about leaving comfort for honesty.",
    meaning: "Choosing emotional truth over convenience.",
    statements: [
      { id: "statement-fact", statementType: "FACT", statement: "The song was written after a difficult conversation.", sourceLabel: "artist" },
      { id: "statement-artist", statementType: "ARTIST_INTERPRETATION", statement: "For me it is about honesty over comfort.", sourceLabel: "artist" },
      { id: "statement-audience", statementType: "AUDIENCE_INTERPRETATION", statement: "Some listeners read it as a breakup song.", sourceLabel: "listener-notes" }
    ],
    identityContext: {
      id: "song-context-1",
      identityVersionId: "identity-version-2",
      eraIdentityId: "era-1",
      songSpecificVisualNotes: "Warm evening light.",
      songSpecificAnchors: ["window light"],
      allowedOverrides: ["warmer palette"],
      version: 3
    }
  },
  approvedKnowledge: [
    { id: "knowledge-1", content: "Avoid manufactured luxury imagery; emotional specificity performs better for this artist.", sourceType: "VOICE_NOTE", sourceId: "voice-1" }
  ],
  toneExamples: [
    { id: "tone-authentic", textContent: "I do not have a clever way to sell this song. I just wanted to sing it honestly.", label: "AUTHENTIC", sourceType: "CAPTION", language: "en", isPrivate: false },
    { id: "tone-private", textContent: "Private diary phrasing that should not be forwarded by default.", label: "AUTHENTIC", sourceType: "PRIVATE_NOTE", language: "en", isPrivate: true },
    { id: "tone-bad", textContent: "STREAM NOW!!! biggest song ever", label: "DO_NOT_COPY", sourceType: "CAPTION", language: "en", isPrivate: false }
  ],
  validatedLearnings: [],
  campaign: null,
  platformConstraints: [
    { id: "platform-current", platform: "INSTAGRAM_REELS", content: "Keep the first visual idea legible without relying on caption text.", freshness: "CURRENT", version: 2 },
    { id: "platform-stale", platform: "INSTAGRAM_REELS", content: "Old platform tactic.", freshness: "STALE", version: 1 }
  ],
  productionCapability: null,
  recentAngles: [
    { id: "angle-1", title: "Already used", pillar: "STORY", status: "APPROVED", idea: "Tell the full song origin as a monologue." },
    { id: "angle-2", title: "Rejected gloss", pillar: "PROMO", status: "REJECTED", idea: "Luxury-car montage." }
  ]
});

describe("ContentAngleContextAssembler", () => {
  it("assembles deterministic provenance-rich song-scoped context without private or negative tone examples", () => {
    const assembler = new ContentAngleContextAssembler();
    const first = assembler.assemble(request(), sources());
    const second = assembler.assemble(request(), sources());

    expect(second).toEqual(first);
    expect(first.song?.id).toBe("song-1");
    expect(first.song?.statements.map((item) => item.statementType)).toEqual(["FACT", "ARTIST_INTERPRETATION", "AUDIENCE_INTERPRETATION"]);
    expect(first.toneExamples.map((item) => item.id)).toEqual(["tone-authentic"]);
    expect(first.platformConstraints.map((item) => item.id)).toEqual(["platform-current"]);
    expect(first.sourceReferences).toEqual(expect.arrayContaining([
      expect.objectContaining({ priority: 3, entityType: "ArtistIdentityVersion", entityId: "identity-version-2" }),
      expect.objectContaining({ priority: 5, entityType: "Song", entityId: "song-1" }),
      expect.objectContaining({ priority: 5, entityType: "SongBrainStatement:ARTIST_INTERPRETATION", entityId: "statement-artist" })
    ]));
    expect(first.missingSources).toEqual(expect.arrayContaining(["HARD_RULES", "PRODUCTION_CAPABILITY_PROFILE", "VALIDATED_LEARNINGS"]));
    expect(first.contextVersion).not.toBe("empty");
  });

  it("removes lower-priority optional evidence until the token budget is met", () => {
    const assembler = new ContentAngleContextAssembler();
    const roomy = assembler.assemble(request(), sources());
    const constrained = assembler.assemble(request({ budget: { maxChunks: 8, maxTokens: 350, maxExamples: 4, maxLearnings: 4 } }), sources());

    expect(constrained.budget.estimatedTokens).toBeLessThanOrEqual(350);
    expect(constrained.budget.truncated).toBe(true);
    expect(constrained.identity).toEqual(roomy.identity);
    expect(constrained.song?.id).toBe("song-1");
    expect(constrained.recentAngles.length).toBeLessThan(roomy.recentAngles.length);
  });

  it("reports BUDGET_EXCEEDED instead of silently overflowing mandatory context", () => {
    const pack = new ContentAngleContextAssembler().assemble(request({ budget: { maxChunks: 0, maxTokens: 1, maxExamples: 0, maxLearnings: 0 } }), sources());
    expect(pack.readiness).toBe("BUDGET_EXCEEDED");
    expect(pack.budget.estimatedTokens).toBeGreaterThan(1);
  });

  it("keeps cold start explicit instead of filling missing identity with generic personalization", () => {
    const source = sources();
    source.identity = null;
    source.song = null;
    source.approvedKnowledge = [];
    source.toneExamples = [];
    source.recentAngles = [];
    source.platformConstraints = [];

    const pack = new ContentAngleContextAssembler().assemble(request(), source);
    expect(pack.readiness).toBe("COLD_START");
    expect(pack.maturity).toBe("COLD");
    expect(pack.identity).toBeNull();
    expect(pack.song).toBeNull();
    expect(pack.missingSources).toEqual(expect.arrayContaining(["ACTIVE_IDENTITY", "SONG_BRAIN"]));
    expect(pack.approvedKnowledge).toEqual([]);
  });
});
