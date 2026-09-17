import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type WeeklyReviewSectionKind =
  | "WHAT_HAPPENED"
  | "WHAT_CHANGED"
  | "WHAT_WAS_LEARNED"
  | "UNCERTAINTIES"
  | "SIGNALS"
  | "DECISIONS_TO_MAKE"
  | "RECOMMENDED_NEXT_FOCUS"
  | "NEXT_ACTIONS";

export interface WeeklyReviewReferenceInput {
  refType: string;
  refId: string;
}

export interface WeeklyReviewItemInput {
  text: string;
  references?: WeeklyReviewReferenceInput[];
}

export interface WeeklyReviewSectionInput {
  kind: WeeklyReviewSectionKind;
  label: string;
  items: WeeklyReviewItemInput[];
}

export interface CreateWeeklyReviewCommand {
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  configurationVersion: string;
  sourceSnapshotIds?: string[];
  insightIds?: string[];
  sections: WeeklyReviewSectionInput[];
}

export interface WeeklyReviewResult {
  weeklyReviewId: string;
  version: number;
  generatedAt: string;
}

export type WeeklyReviewPersistenceCode =
  | "WEEKLY_REVIEW_VERSION_CONFLICT"
  | "IDEMPOTENCY_IN_PROGRESS";

export class WeeklyReviewPersistenceError extends Error {
  constructor(public readonly code: WeeklyReviewPersistenceCode) {
    super(code);
    this.name = "WeeklyReviewPersistenceError";
  }
}

export interface WeeklyReviewWritePort {
  createWeeklyReview(request: {
    artistId: string;
    weeklyReviewId: string;
    command: CreateWeeklyReviewCommand;
    evidence: FoundationEvidence;
  }): Promise<WeeklyReviewResult>;
}

const referenceSchema = z.object({
  refType: z.string().trim().min(1).max(120),
  refId: z.string().trim().min(1).max(240)
});

const itemSchema = z.object({
  text: z.string().trim().min(1).max(4000),
  references: z.array(referenceSchema).max(100).optional()
});

const sectionSchema = z.object({
  kind: z.enum([
    "WHAT_HAPPENED",
    "WHAT_CHANGED",
    "WHAT_WAS_LEARNED",
    "UNCERTAINTIES",
    "SIGNALS",
    "DECISIONS_TO_MAKE",
    "RECOMMENDED_NEXT_FOCUS",
    "NEXT_ACTIONS"
  ]),
  label: z.string().trim().min(1).max(160),
  items: z.array(itemSchema).max(100)
});

const createSchema = z.object({
  periodStart: z.string().datetime({ offset: true }),
  periodEnd: z.string().datetime({ offset: true }),
  generatedAt: z.string().datetime({ offset: true }),
  configurationVersion: z.string().trim().min(1).max(160),
  sourceSnapshotIds: z.array(z.string().trim().min(1).max(240)).max(200).optional(),
  insightIds: z.array(z.string().trim().min(1).max(240)).max(200).optional(),
  sections: z.array(sectionSchema).min(1).max(20)
}).superRefine((value, ctx) => {
  const periodStart = new Date(value.periodStart);
  const periodEnd = new Date(value.periodEnd);
  const generatedAt = new Date(value.generatedAt);

  if (periodEnd <= periodStart) {
    ctx.addIssue({ code: "custom", path: ["periodEnd"], message: "Review period must end after it starts." });
  }
  if (generatedAt < periodEnd) {
    ctx.addIssue({ code: "custom", path: ["generatedAt"], message: "Review cannot be generated before the review period ends." });
  }

  const seenKinds = new Set<WeeklyReviewSectionKind>();
  value.sections.forEach((section, index) => {
    if (seenKinds.has(section.kind)) {
      ctx.addIssue({ code: "custom", path: ["sections", index, "kind"], message: `Section ${section.kind} may appear only once.` });
    }
    seenKinds.add(section.kind);
  });
});

const fieldErrors = (issues: z.ZodIssue[]) => Object.fromEntries(
  issues.map((issue) => [issue.path.join(".") || "form", issue.message])
);

const evidenceFrom = (context: CommandContext): FoundationEvidence => ({
  actorType: context.actor.type,
  ...(context.actor.id ? { actorId: context.actor.id } : {}),
  commandId: context.commandId,
  traceId: context.traceId,
  occurredAt: context.requestedAt,
  ...(context.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {})
});

const requireUser = <T>(context: CommandContext): CommandResult<T> | null => {
  if (context.actor.type === "USER" && context.actor.id) return null;
  return {
    status: "FORBIDDEN",
    code: "WEEKLY_REVIEW_USER_REQUIRED",
    message: "An authenticated user is required to generate a Weekly Review."
  };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof WeeklyReviewPersistenceError) {
    return { status: "CONFLICT", code: error.code, message: "Weekly Review conflicts with current persisted state." };
  }
  return {
    status: "EXTERNAL_FAILURE",
    code: "WEEKLY_REVIEW_PERSISTENCE_FAILED",
    message: "Weekly Review could not be persisted.",
    retryable: true
  };
};

export class CreateWeeklyReviewService {
  constructor(
    private readonly writer: WeeklyReviewWritePort,
    private readonly idFactory = () => globalThis.crypto.randomUUID()
  ) {}

  async execute(command: CreateWeeklyReviewCommand, context: CommandContext): Promise<CommandResult<WeeklyReviewResult>> {
    const denied = requireUser<WeeklyReviewResult>(context);
    if (denied) return denied;

    const parsed = createSchema.safeParse(command);
    if (!parsed.success) {
      return {
        status: "VALIDATION_ERROR",
        code: "WEEKLY_REVIEW_INVALID",
        message: "Weekly Review snapshot is invalid.",
        fieldErrors: fieldErrors(parsed.error.issues)
      };
    }

    const normalized: CreateWeeklyReviewCommand = {
      periodStart: parsed.data.periodStart,
      periodEnd: parsed.data.periodEnd,
      generatedAt: parsed.data.generatedAt,
      configurationVersion: parsed.data.configurationVersion,
      sections: parsed.data.sections.map((section) => ({
        kind: section.kind,
        label: section.label,
        items: section.items.map((item) => ({
          text: item.text,
          ...(item.references?.length ? { references: item.references } : {})
        }))
      })),
      ...(parsed.data.sourceSnapshotIds?.length ? { sourceSnapshotIds: parsed.data.sourceSnapshotIds } : {}),
      ...(parsed.data.insightIds?.length ? { insightIds: parsed.data.insightIds } : {})
    };

    try {
      return {
        status: "SUCCESS",
        data: await this.writer.createWeeklyReview({
          artistId: context.artistId,
          weeklyReviewId: this.idFactory(),
          command: normalized,
          evidence: evidenceFrom(context)
        })
      };
    } catch (error) {
      return mapPersistenceError(error);
    }
  }
}
