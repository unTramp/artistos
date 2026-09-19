import type { AttentionItem } from "@artist-os/core";
import type { Locale } from "./i18n";

const countFromTitle = (title: string) => Number(title.match(/^\d+/)?.[0] ?? "0");

export function localizeAttentionItem(item: AttentionItem, locale: Locale): AttentionItem {
  if (locale === "en") return item;

  let title = item.title;
  let whyThis = [...item.whyThis];
  let expectedEffect = item.expectedEffect;
  let actionLabel = item.action.label;
  let guidanceLabel = item.guidanceRef?.label;

  if (item.id === "foundation:identity") {
    title = "Активируйте идентичность артиста";
    whyThis = ["Будущим рекомендациям нужна одна каноническая активная версия Identity."];
    expectedEffect = "Даёт будущему контенту и стратегии канонический контекст идентичности.";
    actionLabel = "Открыть Identity";
    guidanceLabel = "Что меняет активная Identity";
  } else if (item.id.startsWith("content-unit:") && item.id.endsWith(":execution")) {
    title = item.title.replace(/^Finish execution · /, "Завершить исполнение · ");
    whyThis = ["Content Unit существует, но у него ещё нет утверждённой версии исполнения."];
    expectedEffect = "Разблокирует путь Content Unit к готовности к производству.";
    actionLabel = "Продолжить исполнение";
    guidanceLabel = "Превратить концепцию в готовый к съёмке план";
  } else if (item.id === "content:approved-without-unit") {
    const count = countFromTitle(item.title);
    title = `${count} одобренн${count === 1 ? "ая идея ждёт" : "ых идеи ждут"} решения о производстве`;
    whyThis = ["Одобрение идеи не создаёт Content Unit автоматически."];
    expectedEffect = "Позволяет выбрать, какая одобренная идея действительно должна перейти в производство.";
    actionLabel = "Проверить одобренные идеи";
    guidanceLabel = "От одобренной идеи к производственному обязательству";
  } else if (item.id === "content:angle-review") {
    const count = countFromTitle(item.title);
    title = `${count} иде${count === 1 ? "я контента требует" : "и контента требуют"} решения`;
    whyThis = ["Черновики и отложенные идеи остаются предложениями, пока вы явно их не оцените."];
    actionLabel = "Проверить идеи";
    guidanceLabel = "Как оценивать идею контента";
  } else if (item.id === "knowledge:pending") {
    const count = countFromTitle(item.title);
    title = `${count} кандидат${count === 1 ? " знания ждёт" : "а знаний ждут"} проверки`;
    whyThis = ["Candidate Knowledge не входит в постоянный Artist Brain, пока вы сами его не проверите."];
    expectedEffect = "Сохраняет долговременную память под контролем человека.";
    actionLabel = "Открыть Inbox Мозга";
    guidanceLabel = "Как проверять кандидата Artist Brain";
  } else if (item.id === "music:first-song") {
    title = "Добавьте первую песню";
    whyThis = ["Song Brain даёт будущему контенту и стратегии контекст конкретного трека."];
    actionLabel = "Добавить песню";
    guidanceLabel = "Создать полезный Song Brain";
  } else if (item.id.startsWith("operational-action:")) {
    whyThis = item.whyThis.map((reason) => {
      if (reason === "This operational action is blocked and cannot progress without attention.") return "Это действие заблокировано и не может продолжаться без вашего внимания.";
      if (reason === "This operational action is active and still requires completion.") return "Это действие активно и всё ещё требует завершения.";
      const aligned = reason.match(/^It directly supports the current (primary|secondary) objective: (.+)\.$/);
      if (aligned) return `Оно напрямую поддерживает текущую ${aligned[1] === "primary" ? "главную" : "вторичную"} цель: ${aligned[2]}.`;
      return reason;
    });
    expectedEffect = item.expectedEffect === "Advances the linked workflow without changing source-domain truth by itself."
      ? "Продвигает связанный рабочий процесс, не меняя само по себе каноническое состояние исходного домена."
      : item.expectedEffect;
    actionLabel = item.action.label === "Open action" ? "Открыть действие" : item.action.label === "View action" ? "Посмотреть действие" : item.action.label;
    if (item.guidanceRef?.key === "music.editorial-pitch") guidanceLabel = "Как работает редакционный питчинг";
  }

  return {
    ...item,
    title,
    whyThis,
    ...(expectedEffect ? { expectedEffect } : {}),
    action: { ...item.action, label: actionLabel },
    ...(item.guidanceRef ? { guidanceRef: { ...item.guidanceRef, label: guidanceLabel ?? item.guidanceRef.label } } : {})
  };
}
