import { PgWorkspaceSettingsWriter } from "@artist-os/db";
import { normalizeUiLocale, UI_LOCALE_COOKIE } from "@/lib/i18n";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function PATCH(request: Request) {
  const traceId = getTraceId(request.headers);

  let body: { locale?: string };
  try {
    body = await request.json() as { locale?: string };
  } catch {
    return apiErrorResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON." }, traceId, 400);
  }

  if (body.locale !== "en" && body.locale !== "ru") {
    return apiErrorResponse({ code: "LOCALE_UNSUPPORTED", message: "locale must be en or ru." }, traceId, 400);
  }

  const locale = normalizeUiLocale(body.locale);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);

  if (actorContext?.artistId) {
    const writer = new PgWorkspaceSettingsWriter(getDatabaseRuntime().db);
    await writer.updateLocale(actorContext.artistId, locale);
  }

  const response = successResponse({ locale }, traceId);
  response.cookies.set(UI_LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
  return response;
}
