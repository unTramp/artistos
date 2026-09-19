import type { AttentionItem } from "@artist-os/core";
import type { Locale } from "./i18n";

const parseCount = (title: string) => {
  const value = Number(title.match(/^\d+/)?.[0] ?? "0");
  return Number.isFinite(value) ? value : 0;
};

const ruActionLabel = (label: string) => {
  const map: Record<string, string> = {
    "Open Identity": "Открыть Идентичность",
    "Continue execution": "Продолжить исполнение",
    "Review approved angles": "Проверить одобренные идеи",
    "Review angles": "Проверить идеи",
    "Review Brain inbox": "Открыть входящие Контекста",
    "Add song": "Добавить песню",
    "Open action": "Открыть действие",
    "View action": "Открыть действие"
  };
  return map[label] ?? label;
};

const ruGuidanceLabel = (label: string) => {
  const map: Record<string, string> = {
    "What an active Identity changes": "Что меняет активная Идентичность",
    "Turn a concept into shoot-ready execution": "Превратить концепцию в готовое к съёмке исполнение",
    "From approved idea to production commitment": "От одобренной идеи к производственному обязательству",
    "How to judge a content angle": "Как оценить контент-идею",
    "How to review a Brain candidate": "Как проверить кандидата в Artist Brain",
    "Build a useful Song Brain": "Собрать полезный Song Brain",
    "How editorial pitching works": "Как работает редакторский питч"
  };
  return map[label] ?? label;
};

const localizeOperationalWhy = (value: string) => {
  if (value === "This operational action is blocked and cannot progress without attention.") {
    return "Это действие заблокировано и не может продвигаться без вашего внимания.";
  }
  if (value === "This operational action is active and still requires completion.") {
    return "Это действие активно и всё ещё требует завершения.";
  }
  const objective = value.match(/^It directly supports the current (primary|secondary) objective: (.+)\.$/);
  if (objective) {
    const priority = objective[1] === "primary" ? "главную" : "вторичную";
    return `Оно напрямую поддерживает текущую ${priority} цель: ${objective[2]}.`;
  }
  return value;
};

export function localizeAttentionItem(item: AttentionItem, locale: Locale): AttentionItem {
  if (locale !== "ru") return item;

  let title = item.title;
  let whyThis = [...item.whyThis];
  let expectedEffect = item.expectedEffect;
  let whatWillBeLearned = item.whatWillBeLearned;

  if (item.id === "foundation:identity") {
    title = "Активируйте идентичность артиста";
    whyThis = ["Будущим рекомендациям нужна одна каноническая активная Версия Идентичности."];
    expectedEffect = "Даёт будущей работе с контентом и стратегией канонический контекст идентичности.";
  } else if (item.id.startsWith("content-unit:") && item.id.endsWith(":execution")) {
    title = item.title.replace(/^Finish execution · /, "Завершите исполнение · ");
    whyThis = ["Контент-юнит существует, но у него нет одобренной ревизии исполнения."];
    expectedEffect = "Разблокирует путь контент-юнита к готовности к исполнению.";
  } else if (item.id === "content:approved-without-unit") {
    const count = parseCount(item.title);
    title = `${count} ${count === 1 ? "одобренная идея ждёт" : "одобренных идей ждут"} производственного решения`;
    whyThis = ["Одобрение не создаёт Контент-юнит автоматически."];
    expectedEffect = "Позволяет выбрать, какая одобренная идея действительно должна перейти в производство.";
  } else if (item.id === "content:angle-review") {
    const count = parseCount(item.title);
    title = `${count} ${count === 1 ? "контент-идея требует" : "контент-идей требуют"} решения`;
    whyThis = ["Черновики и отложенные идеи остаются предложениями, пока вы явно их не оцените."];
  } else if (item.id === "knowledge:pending") {
    const count = parseCount(item.title);
    title = `${count} ${count === 1 ? "кандидат знания ждёт" : "кандидатов знания ждут"} проверки`;
    whyThis = ["Кандидат знания остаётся вне постоянного Artist Brain, пока вы явно его не проверите."];
    expectedEffect = "Сохраняет устойчивый контекст под контролем человека.";
  } else if (item.id === "music:first-song") {
    title = "Добавьте первую песню";
    whyThis = ["Song Brain даёт будущим решениям по контенту и стратегии контекст конкретного трека."];
  } else if (item.id.startsWith("operational-action:")) {
    whyThis = item.whyThis.map(localizeOperationalWhy);
    expectedEffect = "Продвигает связанный рабочий процесс, не меняя самостоятельно истину исходного домена.";
  }

  return {
    ...item,
    title,
    whyThis,
    ...(expectedEffect ? { expectedEffect } : {}),
    ...(whatWillBeLearned ? { whatWillBeLearned } : {}),
    action: { ...item.action, label: ruActionLabel(item.action.label) },
    ...(item.guidanceRef ? {
      guidanceRef: { ...item.guidanceRef, label: ruGuidanceLabel(item.guidanceRef.label) }
    } : {})
  };
}
