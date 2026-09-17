import { CreateOperationalActionService, type OperationalActionExecutionMode, type OperationalActionPriority } from "@artist-os/core";
import { PgOperationalActionWriter, getWeeklyReview } from "@artist-os/db";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { apiErrorResponse } from "@/lib/http";
import { resolveOperationalActionMutationContext } from "@/lib/operational-action-command";
import { getDatabaseRuntime } from "@/lib/runtime";

interface CreateReviewActionBody {
  title: string;
  description?: string;
  actionType: string;
  priority?: OperationalActionPriority;
  dueAt?: string;
  notBefore?: string;
  executionMode: OperationalActionExecutionMode;
  externalUrl?: string;
  sectionKind?: "NEXT_ACTIONS" | "SIGNALS";
  itemIndex?: number;
}

export async function POST(request: Request, context: { params: Promise<{ weeklyReviewId: string }> }) {
  const resolution = await resolveOperationalActionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateReviewActionBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { weeklyReviewId } = await context.params;

  const runtime = getDatabaseRuntime();
  const review = await getWeeklyReview(runtime.db, resolution.commandContext.artistId, weeklyReviewId);
  if (!review) return apiErrorResponse({ code: "WEEKLY_REVIEW_NOT_FOUND", message: "Weekly Review was not found." }, resolution.traceId, 404);

  if (body.sectionKind) {
    const targetSection = review.sections.find((section) => section.kind === body.sectionKind);
    if (!targetSection) return apiErrorResponse({ code: "WEEKLY_REVIEW_SECTION_NOT_FOUND", message: "Requested Weekly Review section does not exist." }, resolution.traceId, 400);
    if (body.itemIndex !== undefined && !targetSection.items[body.itemIndex]) {
      return apiErrorResponse({ code: "WEEKLY_REVIEW_ITEM_NOT_FOUND", message: "Requested Weekly Review item does not exist." }, resolution.traceId, 400);
    }
  }

  const result = await new CreateOperationalActionService(new PgOperationalActionWriter(runtime.db)).execute({
    sourceDomain: "INTELLIGENCE",
    sourceEntityType: "WeeklyReview",
    sourceEntityId: weeklyReviewId,
    title: body.title,
    actionType: body.actionType,
    executionMode: body.executionMode,
    ...(body.description ? { description: body.description } : {}),
    ...(body.priority ? { priority: body.priority } : {}),
    ...(body.dueAt ? { dueAt: body.dueAt } : {}),
    ...(body.notBefore ? { notBefore: body.notBefore } : {}),
    ...(body.externalUrl ? { externalUrl: body.externalUrl } : {})
  }, resolution.commandContext);

  return commandResultResponse(result, resolution.traceId, 201);
}
