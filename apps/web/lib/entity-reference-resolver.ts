import {
  PgArtistFoundationReader,
  PgContentFactoryReader,
  PgDecisionReader,
  PgKnowledgeReader,
  PgOperationalActionReader,
  PgPlanningObjectiveReader,
  getLearning,
  getWeeklyReview,
  type Stage0Database
} from "@artist-os/db";
import { hrefForEntityReference } from "./entity-href";
import {
  entityReferenceKey,
  humanizeEntityType,
  shortEntityId,
  type EntityReferenceInput,
  type ResolvedEntityReference
} from "./entity-reference";

const truncate = (value: string, limit = 92) =>
  value.length > limit ? `${value.slice(0, limit - 1)}…` : value;

export class EntityReferenceResolver {
  private readonly decisions: PgDecisionReader;
  private readonly actions: PgOperationalActionReader;
  private readonly objectives: PgPlanningObjectiveReader;
  private readonly factory: PgContentFactoryReader;
  private readonly artist: PgArtistFoundationReader;
  private readonly knowledge: PgKnowledgeReader;

  private unitsPromise?: ReturnType<PgContentFactoryReader["listUnits"]>;
  private songsPromise?: ReturnType<PgArtistFoundationReader["listSongs"]>;
  private identityPromise?: ReturnType<PgArtistFoundationReader["getIdentityHome"]>;
  private knowledgePromise?: ReturnType<PgKnowledgeReader["getHome"]>;

  constructor(
    private readonly db: Stage0Database,
    private readonly artistId: string
  ) {
    this.decisions = new PgDecisionReader(db);
    this.actions = new PgOperationalActionReader(db);
    this.objectives = new PgPlanningObjectiveReader(db);
    this.factory = new PgContentFactoryReader(db);
    this.artist = new PgArtistFoundationReader(db);
    this.knowledge = new PgKnowledgeReader(db);
  }

  private unresolved(reference: EntityReferenceInput): ResolvedEntityReference {
    return {
      ...reference,
      label: `${humanizeEntityType(reference.type)} · ${shortEntityId(reference.id)}`,
      href: hrefForEntityReference(reference.type, reference.id),
      resolved: false
    };
  }

  async resolve(reference: EntityReferenceInput): Promise<ResolvedEntityReference> {
    const href = hrefForEntityReference(reference.type, reference.id);
    const type = reference.type.toLowerCase();

    if (type === "decision") {
      const decision = await this.decisions.getDecision(this.artistId, reference.id);
      return decision
        ? { ...reference, label: decision.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "learning") {
      const learning = await getLearning(this.db, this.artistId, reference.id);
      return learning
        ? { ...reference, label: truncate(learning.statement), href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "weeklyreview") {
      const review = await getWeeklyReview(this.db, this.artistId, reference.id);
      return review
        ? {
            ...reference,
            label: `Weekly Review · ${review.periodStart.toISOString().slice(0, 10)} → ${review.periodEnd.toISOString().slice(0, 10)}`,
            href,
            resolved: true
          }
        : this.unresolved(reference);
    }

    if (type === "operationalaction") {
      const action = await this.actions.getAction(this.artistId, reference.id);
      return action
        ? { ...reference, label: action.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "planningobjective") {
      const objective = await this.objectives.getObjective(this.artistId, reference.id);
      return objective
        ? { ...reference, label: objective.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "contentangle") {
      const angle = await this.factory.getAngle(this.artistId, reference.id);
      return angle
        ? { ...reference, label: angle.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "contentunit") {
      this.unitsPromise ??= this.factory.listUnits(this.artistId);
      const unit = (await this.unitsPromise).find((candidate) => candidate.id === reference.id);
      return unit
        ? { ...reference, label: unit.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "song") {
      this.songsPromise ??= this.artist.listSongs(this.artistId);
      const song = (await this.songsPromise).find((candidate) => candidate.id === reference.id);
      return song
        ? { ...reference, label: song.title, href, resolved: true }
        : this.unresolved(reference);
    }

    if (type === "identityversion" || type === "artistidentity") {
      this.identityPromise ??= this.artist.getIdentityHome(this.artistId);
      const identity = await this.identityPromise;
      if (type === "artistidentity" && identity.identityId === reference.id) {
        return { ...reference, label: "Artist identity", href, resolved: true };
      }
      const version = [identity.activeVersion, ...identity.draftVersions]
        .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
        .find((candidate) => candidate.id === reference.id);
      return version
        ? {
            ...reference,
            label: version.label?.trim() || `Artist Identity v${version.versionNumber}`,
            href,
            resolved: true
          }
        : this.unresolved(reference);
    }

    if (type === "candidateknowledge") {
      this.knowledgePromise ??= this.knowledge.getHome(this.artistId);
      const candidate = (await this.knowledgePromise).candidates.find((item) => item.id === reference.id);
      return candidate
        ? { ...reference, label: truncate(candidate.content), href, resolved: true }
        : this.unresolved(reference);
    }

    return this.unresolved(reference);
  }

  async resolveMany(references: EntityReferenceInput[]): Promise<Record<string, ResolvedEntityReference>> {
    const unique = new Map<string, EntityReferenceInput>();
    for (const reference of references) {
      unique.set(entityReferenceKey(reference.type, reference.id), reference);
    }

    const resolved = await Promise.all([...unique.values()].map((reference) => this.resolve(reference)));
    return Object.fromEntries(resolved.map((reference) => [
      entityReferenceKey(reference.type, reference.id),
      reference
    ]));
  }
}
