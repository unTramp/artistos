import { describe, expect, it } from "vitest";
import type { AttentionItem } from "@artist-os/core";
import { localizeAttentionItem, normalizeUiLocale } from "./i18n";

const item = (overrides: Partial<AttentionItem> = {}): AttentionItem => ({
  id: "operational-action:1",
  kind: "NEXT_ACTION",
  priority: "HIGH",
  title: "Prepare Trastevere performance clip",
  whyThis: ["This operational action is active and still requires completion."],
  basedOn: [{ type: "OperationalAction", id: "1" }],
  uncertainty: [],
  blockedBy: [],
  expectedEffect: "Advances the linked workflow without changing source-domain truth by itself.",
  action: { label: "View action", href: "/actions/1" },
  objectiveAligned: false,
  ...overrides
});

describe("UI localization", () => {
  it("normalizes Russian locale variants", () => {
    expect(normalizeUiLocale("ru-RU")).toBe("ru");
    expect(normalizeUiLocale("en-US")).toBe("en");
    expect(normalizeUiLocale(undefined)).toBe("en");
  });

  it("localizes system-owned Attention copy without translating artist-owned titles", () => {
    const localized = localizeAttentionItem("ru", item());

    expect(localized.title).toBe("Prepare Trastevere performance clip");
    expect(localized.whyThis[0]).toBe("Это рабочее действие активно и всё ещё требует завершения.");
    expect(localized.expectedEffect).toBe("Продвигает связанный процесс, не изменяя самостоятельно каноническое состояние исходного домена.");
    expect(localized.action.label).toBe("Открыть действие");
  });

  it("localizes deterministic setup recommendations", () => {
    const localized = localizeAttentionItem("ru", item({
      id: "music:first-song",
      kind: "MUSIC",
      title: "Add your first song",
      whyThis: ["Song Brain gives future content and strategy decisions track-specific context."],
      basedOn: [],
      action: { label: "Add song", href: "/songs" }
    }));

    expect(localized.title).toBe("Добавьте первую песню");
    expect(localized.action.label).toBe("Добавить песню");
  });
});
