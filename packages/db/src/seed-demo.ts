import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required. Run through pnpm demo:seed with a repository .env file.");

const pool = new Pool({ connectionString: databaseUrl });
let client: PoolClient | null = null;

async function resolveArtist() {
  const email = process.env.DEMO_EMAIL?.trim();
  if (email) {
    const result = await pool.query<{ artist_id: string; email: string }>(`
      select am.artist_id, u.email
      from artist_memberships am
      join auth."user" u on u.id = am.auth_user_id
      where lower(u.email) = lower($1)
      limit 1
    `, [email]);
    if (!result.rows[0]) throw new Error(`No Artist workspace found for DEMO_EMAIL=${email}. Sign up and complete onboarding first.`);
    return result.rows[0];
  }

  const result = await pool.query<{ artist_id: string; email: string }>(`
    select am.artist_id, u.email
    from artist_memberships am
    join auth."user" u on u.id = am.auth_user_id
    order by am.created_at asc
    limit 2
  `);
  if (result.rows.length === 0) throw new Error("No Artist workspace found. Sign up and complete onboarding first.");
  if (result.rows.length > 1) throw new Error("Multiple local workspaces found. Set DEMO_EMAIL in the shell to choose one explicitly.");
  return result.rows[0]!;
}

async function main() {
  const target = await resolveArtist();
  const counts = await pool.query<{ identities: number; songs: number; angles: number }>(`
    select
      (select count(*)::int from artist_identities where artist_id = $1) as identities,
      (select count(*)::int from songs where artist_id = $1) as songs,
      (select count(*)::int from content_angles where artist_id = $1) as angles
  `, [target.artist_id]);
  const current = counts.rows[0]!;
  if (current.identities > 0 || current.songs > 0 || current.angles > 0) {
    throw new Error(`Demo seed only runs on an empty Artist workspace. ${target.email} already has domain data.`);
  }

  client = await pool.connect();
  await client.query("begin");

  const artistId = target.artist_id;
  const identityId = randomUUID();
  const identityVersionId = randomUUID();
  const eraId = randomUUID();
  const songA = randomUUID();
  const songB = randomUUID();
  const songC = randomUUID();
  const candidateAccepted = randomUUID();
  const candidatePending = randomUUID();
  const approvedKnowledgeId = randomUUID();
  const snapshotId = randomUUID();
  const angleApproved = randomUUID();
  const angleDraft = randomUUID();
  const angleDeferred = randomUUID();
  const unitId = randomUUID();

  await client.query(`insert into artist_identities (id, artist_id, active_version_id) values ($1,$2,null)`, [identityId, artistId]);
  await client.query(`
    insert into artist_identity_versions (id, identity_id, artist_id, version_number, label, status, activated_at)
    values ($1,$2,$3,1,'Nocturne · honest / restrained','ACTIVE',now())
  `, [identityVersionId, identityId, artistId]);
  await client.query(`update artist_identities set active_version_id=$1, updated_at=now() where id=$2`, [identityVersionId, identityId]);
  await client.query(`
    insert into era_identities (id, artist_id, identity_version_id, name, narrative_chapter, visual_overrides, new_anchors, retired_anchors, color_overrides, status, start_date)
    values ($1,$2,$3,'Nocturne','Intimate discovery era', $4::jsonb, $5::jsonb, '[]'::jsonb, $6::jsonb, 'ACTIVE', current_date)
  `, [eraId, artistId, identityVersionId, JSON.stringify({ lighting: "directional / low-key" }), JSON.stringify(["silver microphone", "night blue light"]), JSON.stringify({ accent: "violet / indigo" })]);

  const songs = [
    [songA, "Midnight Signals", "ORIGINAL", true, null, "Alternative Pop", "Intimate / nocturnal", "en", "A city memory becomes inseparable from one person.", "Closeness, distance and memory."],
    [songB, "Paper Skyline", "ORIGINAL", true, null, "Pop Ballad", "Tender", "en", "A quiet song about rebuilding after a goodbye.", "Hope without forced positivity."],
    [songC, "After the Last Train", "COVER", false, "Demo Reference", "Ballad", "Restrained", "en", "A familiar song reframed through a quieter performance.", "Regret and tenderness."]
  ] as const;
  for (const song of songs) {
    await client.query(`
      insert into songs (id, artist_id, title, type, is_original, original_artist, genre, mood, language, story, meaning, platform_links)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'{}'::jsonb)
    `, [song[0], artistId, ...song.slice(1)]);
  }

  const statements = [
    [songA, "FACT", "The core visual memory is a night city rather than a literal relationship scene.", "demo-seed"],
    [songA, "ARTIST_INTERPRETATION", "I hear the song as remembering a person through a place, not explaining what happened.", "demo-seed"],
    [songA, "AUDIENCE_INTERPRETATION", "Some listeners may read the final section as a goodbye.", "demo-seed"],
    [songB, "ARTIST_INTERPRETATION", "The emotional movement should feel like hope arriving quietly, not triumph.", "demo-seed"]
  ];
  for (const statement of statements) {
    await client.query(`
      insert into song_brain_statements (id, artist_id, song_id, statement_type, statement, source_label)
      values ($1,$2,$3,$4,$5,$6)
    `, [randomUUID(), artistId, ...statement]);
  }

  await client.query(`
    insert into song_identity_contexts (id, artist_id, song_id, identity_version_id, era_identity_id, song_specific_visual_notes, song_specific_anchors, allowed_overrides)
    values ($1,$2,$3,$4,$5,'Night city, negative space, restrained performance',$6::jsonb,$7::jsonb)
  `, [randomUUID(), artistId, songA, identityVersionId, eraId, JSON.stringify(["night reflections", "silver mic"]), JSON.stringify(["warmer skin tone"])]);

  const tone = [
    ["I do not want to explain every line. I would rather leave one honest image and let the song finish the thought.", "AUTHENTIC"],
    ["Some songs need a bigger statement. This one needs a quieter room.", "GOOD"],
    ["STREAM NOW!!! This is the best song you will hear today.", "DO_NOT_COPY"]
  ];
  for (const item of tone) {
    await client.query(`
      insert into tone_corpus_items (id, artist_id, text_content, label, source_type, source_reference, language, is_private)
      values ($1,$2,$3,$4,'DEMO_SEED','local-demo','en',false)
    `, [randomUUID(), artistId, item[0], item[1]]);
  }

  await client.query(`
    insert into candidate_knowledge (id, artist_id, source_type, source_id, content, destination, status, confidence_metadata, resolution_reason, resolved_at)
    values ($1,$2,'DEMO_SEED','demo-identity-1','Restrained story-led content fits the current artist identity better than aggressive promotional framing.','ARTIST_BRAIN','ACCEPTED',$3::jsonb,'Accepted demo knowledge for local product exploration.',now())
  `, [candidateAccepted, artistId, JSON.stringify({ confidence: "MEDIUM", demo: true })]);
  await client.query(`
    insert into artist_brain_knowledge_items (id, artist_id, content, source_candidate_id, source_type, source_id)
    values ($1,$2,'Restrained story-led content fits the current artist identity better than aggressive promotional framing.',$3,'DEMO_SEED','demo-identity-1')
  `, [approvedKnowledgeId, artistId, candidateAccepted]);
  await client.query(`
    insert into candidate_knowledge (id, artist_id, source_type, source_id, content, destination, status, confidence_metadata)
    values ($1,$2,'DEMO_SEED','demo-listener-1','Listeners may associate the final section of Midnight Signals with a goodbye.','SONG_BRAIN','PENDING',$3::jsonb)
  `, [candidatePending, artistId, JSON.stringify({ confidence: "LOW", demo: true })]);

  const snapshotPayload = {
    identity: { identityVersionId, versionNumber: 1, label: "Nocturne · honest / restrained" },
    era: { eraId, name: "Nocturne", identityVersionId },
    approvedKnowledge: [{ id: approvedKnowledgeId, content: "Restrained story-led content fits the current artist identity better than aggressive promotional framing.", sourceCandidateId: candidateAccepted, sourceType: "DEMO_SEED", sourceId: "demo-identity-1" }],
    toneExamples: tone.slice(0, 2).map((item, index) => ({ id: `demo-tone-${index + 1}`, textContent: item[0], label: item[1], sourceType: "DEMO_SEED", language: "en", isPrivate: false })),
    hardRules: [],
    validatedLearnings: []
  };
  await client.query(`
    insert into artist_brain_snapshots (id, artist_id, version_number, payload, source_refs, built_at)
    values ($1,$2,1,$3::jsonb,$4::jsonb,now())
  `, [snapshotId, artistId, JSON.stringify(snapshotPayload), JSON.stringify([{ type: "IDENTITY_VERSION", id: identityVersionId }, { type: "ARTIST_BRAIN_KNOWLEDGE", id: approvedKnowledgeId }])]);

  const angleBase = {
    songId: songA,
    identityVersionId,
    eraIdentityId: eraId,
    pillar: "STORY",
    mode: "EVERGREEN",
    goal: "Music discovery through story context",
    audience: "Listeners who respond to intimate story-led artist content",
    platformTargets: ["INSTAGRAM_REELS", "TIKTOK"],
    requiredAssets: ["performance take", "clean audio"],
    learningValue: "Tests whether story context improves intent before a music CTA.",
    identityFitRationale: "Direct, emotionally open and understated rather than promotional.",
    productionEffort: "Low · one room, one camera, existing audio setup",
    sourceType: "MANUAL"
  };
  const angleRows = [
    { id: angleApproved, title: "The line before the song", idea: "Say one honest sentence about where the lyric came from, then move immediately into the performance.", why: "The Song Brain already contains a place-memory interpretation that can open the performance without over-explaining it.", status: "APPROVED", decisionNote: "Strong identity fit and low production cost." },
    { id: angleDraft, title: "Same city, different memory", idea: "Use a quiet night-city visual before the chorus and let the place carry the story.", why: "The song's canonical context already links memory to a city image.", status: "DRAFT", decisionNote: null },
    { id: angleDeferred, title: "Fan first-listen reaction", idea: "Capture a genuine first reaction to the unreleased chorus.", why: "Could add social proof, but requires coordination and consent that may not fit current capacity.", status: "DEFERRED", decisionNote: "Revisit when production capacity is higher." }
  ];
  for (const row of angleRows) {
    const snapshot = { ...angleBase, title: row.title, idea: row.idea, why: row.why };
    await client.query(`
      insert into content_angles (
        id, artist_id, song_id, identity_version_id, era_identity_id, title, idea, pillar, mode, goal, audience,
        platform_targets, required_assets, learning_value, why, identity_fit_rationale, production_effort, source_type,
        source_provenance, original_snapshot, status, decision_note, decided_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14,$15,$16,$17,$18,'{}'::jsonb,$19::jsonb,$20,$21,$22)
    `, [row.id, artistId, angleBase.songId, angleBase.identityVersionId, angleBase.eraIdentityId, row.title, row.idea, angleBase.pillar, angleBase.mode, angleBase.goal, angleBase.audience, JSON.stringify(angleBase.platformTargets), JSON.stringify(angleBase.requiredAssets), angleBase.learningValue, row.why, angleBase.identityFitRationale, angleBase.productionEffort, angleBase.sourceType, JSON.stringify(snapshot), row.status, row.decisionNote, row.status === "DRAFT" ? null : new Date()]);
    await client.query(`
      insert into content_angle_revisions (id, artist_id, angle_id, revision_number, revision_type, snapshot)
      values ($1,$2,$3,1,'CREATE',$4::jsonb)
    `, [randomUUID(), artistId, row.id, JSON.stringify(snapshot)]);
  }
  await client.query(`
    insert into content_angle_revisions (id, artist_id, angle_id, revision_number, revision_type, snapshot)
    values ($1,$2,$3,2,'APPROVE',$4::jsonb)
  `, [randomUUID(), artistId, angleApproved, JSON.stringify({ ...angleBase, title: angleRows[0]!.title, idea: angleRows[0]!.idea, why: angleRows[0]!.why, status: "APPROVED" })]);

  await client.query(`
    insert into content_units (id, artist_id, unit_code, angle_id, song_id, identity_version_id, era_identity_id, title, idea, pillar, platform_targets, priority, status)
    values ($1,$2,'DEMO-STORY-001',$3,$4,$5,$6,$7,$8,'STORY',$9::jsonb,'HIGH','APPROVED')
  `, [unitId, artistId, angleApproved, songA, identityVersionId, eraId, angleRows[0]!.title, angleRows[0]!.idea, JSON.stringify(angleBase.platformTargets)]);
  await client.query(`
    insert into content_unit_status_history (id, artist_id, content_unit_id, from_status, to_status, reason, command_id, changed_at)
    values ($1,$2,$3,null,'APPROVED','Created by local demo seed','demo-seed',now())
  `, [randomUUID(), artistId, unitId]);

  await client.query("commit");
  console.log(`Demo data seeded for ${target.email}. Open http://localhost:3000 and refresh Today.`);
}

main()
  .catch(async (error: unknown) => {
    if (client) await client.query("rollback").catch(() => undefined);
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    client?.release();
    await pool.end();
  });
