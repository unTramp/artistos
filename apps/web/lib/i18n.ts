import type { AttentionGuidanceRef, AttentionItem } from "@artist-os/core";

export type UiLocale = "en" | "ru";

export const UI_LOCALE_COOKIE = "artist-os-locale";
export const DEFAULT_UI_LOCALE: UiLocale = "en";

export const normalizeUiLocale = (value: string | null | undefined): UiLocale =>
  value?.toLowerCase().startsWith("ru") ? "ru" : "en";

export const uiCopy = {
  en: {
    shell: {
      tagline: "Human-Controlled · Evidence-Driven",
      activeWorkspace: "Active workspace",
      authRequired: "Authentication required",
      learningLoop: "Learning loop active",
      learningLoopPath: "Context → Action → Evidence → Learning → Better decision",
      contextReady: "Context Ready",
      signIn: "Sign in",
      primaryNav: "Primary",
      workspace: "Artist OS workspace",
      workspaceLabel: "Artist Workspace"
    },
    nav: { today: "Today", create: "Create", music: "Music", brain: "Brain", memory: "Memory", account: "Account" },
    language: { label: "Interface language", en: "EN", ru: "RU", saving: "Saving language…" },
    command: {
      open: "Open command palette",
      search: "Search or run command",
      searchAria: "Search commands",
      placeholder: "Search pages, actions or questions…",
      emptyTitle: "No matching command",
      emptyBody: "Try Today, blockers, Weekly Review, song, Brain or content.",
      navigate: "Navigate",
      create: "Create",
      operate: "Operate",
      navHint: "Navigate",
      openHint: "Open",
      boundary: "Launcher only · no hidden mutations"
    },
    today: {
      eyebrow: "DAILY OS",
      title: "Today",
      description: "What needs attention now? Artist OS projects current canonical state into one primary action, a bounded attention queue and the provenance that explains why.",
      primary: "PRIMARY",
      clear: "CLEAR",
      noBlockers: "No immediate blockers",
      noBlockersBody: "Your implemented workflows have no unresolved deterministic attention item. Artist OS is not filling the gap with generic AI advice.",
      createWithContext: "Create with context",
      next: "NEXT",
      queue: "Attention queue",
      secondarySignal: "secondary signal",
      secondarySignals: "secondary signals",
      noSecondary: "No secondary attention items right now.",
      lowerPriority: "lower-priority signal",
      lowerPriorityPlural: "lower-priority signals",
      notExpanded: "not expanded here.",
      context: "CONTEXT",
      whyHere: "Why this is here",
      contextAria: "Context for primary attention",
      whyHereBody: "Only direct provenance from the current primary recommendation is shown here. Recency alone does not make something relevant.",
      memoryInUse: "MEMORY IN USE",
      workflowContext: "WORKFLOW CONTEXT",
      blockedBy: "BLOCKED BY",
      unresolved: "UNRESOLVED",
      noExtraRef: "No additional entity reference is required for this deterministic recommendation.",
      noPrimaryContext: "No primary attention item is active, so Artist OS has no recommendation provenance to surface here.",
      openMemory: "Open Memory",
      openBrain: "Open Brain",
      aligned: "Aligned with current objective",
      kind: {
        BLOCKER: "BLOCKED",
        NEXT_ACTION: "NEXT",
        REVIEW: "REVIEW",
        MEMORY: "MEMORY",
        FOUNDATION: "FOUNDATION",
        MUSIC: "MUSIC"
      },
      signedOutEyebrow: "YOUR CAREER · ONE OPERATING SYSTEM",
      signedOutTitle: "Know what matters next.",
      signedOutBody: "Artist OS connects your identity, music, memory and execution so the next decision starts with context instead of a blank page.",
      startHere: "START HERE",
      establishWorkspace: "Establish your artist workspace",
      establishWorkspaceBody: "Sign in or create an account. Artist OS will keep every future decision inside your private artist scope.",
      welcome: "WELCOME TO ARTIST OS",
      createWorkspace: "Create your artist workspace.",
      createWorkspaceBody: "Three essentials are enough to start. Everything else should be learned progressively as you use the product.",
      onboarding: "ONBOARDING",
      noDevTools: "No DevTools required",
      noDevToolsBody: "Create the canonical Artist scope, then Artist OS can begin building Identity, Song Brain and memory around your real work.",
      createWorkspaceAction: "Create workspace"
    },
    focus: {
      label: "CURRENT FOCUS",
      noPrimary: "No primary focus yet",
      noPrimaryBody: "Define one operational focus for the current period. When it is linked to concrete work, Today can use that evidence as a bounded ranking signal.",
      setCurrent: "Set current focus",
      currentPrimary: "CURRENT PRIMARY FOCUS",
      complete: "Complete focus",
      setLabel: "SET CURRENT FOCUS",
      whatMatters: "What matters most right now?",
      helper: "Keep this operational. A manual focus records your intent; linked evidence from workflows can later make its effect on Today explicit.",
      cancel: "Cancel",
      title: "Focus title",
      titlePlaceholder: "e.g. Build momentum around the next release",
      success: "What does success look like?",
      successPlaceholder: "Describe the operational intent in one or two sentences.",
      starts: "Starts",
      ends: "Ends",
      footer: "PRIMARY · ARTIST-LEVEL · HUMAN-CONTROLLED",
      saving: "Saving…",
      set: "Set focus"
    },
    action: {
      start: "Start",
      done: "Done",
      block: "Block",
      resolve: "Resolve blocker",
      blockReason: "Block reason",
      resolutionReason: "Resolution reason",
      blockPlaceholder: "What is blocking this?",
      resolutionPlaceholder: "What changed?",
      confirmBlock: "Confirm block",
      reopen: "Reopen",
      updateError: "Action could not be updated."
    },
    why: {
      trigger: "Why this?",
      triggerAria: "Why this recommendation:",
      close: "Close explanation",
      back: "← Back to why",
      learn: "LEARN",
      whyThis: "WHY THIS",
      contextualGuidance: "CONTEXTUAL GUIDANCE",
      applyTo: "Apply to",
      ready: "READY TO APPLY",
      applyNow: "Apply now",
      returnRecommendation: "Return to recommendation",
      currentObjective: "Current objective aligned",
      basedOn: "BASED ON",
      noRef: "No additional entity reference is required for this deterministic state.",
      maturity: "BASIS MATURITY",
      directRef: "direct provenance ref",
      directRefs: "direct provenance refs",
      uncertainty: "UNCERTAINTY",
      lowUncertainty: "Low — this recommendation comes from deterministic current state.",
      blockedBy: "BLOCKED BY",
      expectedEffect: "EXPECTED EFFECT",
      expectedFallback: "Completing this item resolves the currently surfaced attention state.",
      learnOutcome: "WHAT WE MAY LEARN",
      learnFallback: "No learning claim is implied — this is operational or readiness work.",
      learnBefore: "LEARN BEFORE DOING",
      optional: "optional",
      unavailable: "Unavailable",
      unavailableTitle: "Guidance content is not available for this reference",
      maturityLabels: {
        FOUNDATION_CONTEXT: "FOUNDATION CONTEXT",
        CONTEXTUAL_STATE: "CONTEXTUAL STATE",
        WORKFLOW_EVIDENCE: "WORKFLOW EVIDENCE",
        ARTIST_SPECIFIC_MEMORY: "ARTIST-SPECIFIC MEMORY"
      },
      maturityDescriptions: {
        FOUNDATION_CONTEXT: "This deterministic setup recommendation does not require additional artist-specific evidence yet.",
        CONTEXTUAL_STATE: "This recommendation uses explicit current context, but does not claim artist-specific learned memory unless that provenance is present.",
        WORKFLOW_EVIDENCE: "This recommendation is grounded in durable state from work already happening inside Artist OS.",
        ARTIST_SPECIFIC_MEMORY: "This recommendation directly cites artist-specific decision, learning or evidence lineage. The label reflects provenance, not a quality score."
      }
    }
  },
  ru: {
    shell: {
      tagline: "Под контролем артиста · На основе данных",
      activeWorkspace: "Активное пространство",
      authRequired: "Требуется вход",
      learningLoop: "Контур обучения активен",
      learningLoopPath: "Контекст → Действие → Факт → Вывод → Лучшее решение",
      contextReady: "Контекст готов",
      signIn: "Войти",
      primaryNav: "Основная навигация",
      workspace: "Рабочее пространство Artist OS",
      workspaceLabel: "Пространство артиста"
    },
    nav: { today: "Сегодня", create: "Создать", music: "Музыка", brain: "Мозг", memory: "Память", account: "Аккаунт" },
    language: { label: "Язык интерфейса", en: "EN", ru: "RU", saving: "Сохраняем язык…" },
    command: {
      open: "Открыть палитру команд",
      search: "Поиск или команда",
      searchAria: "Поиск команд",
      placeholder: "Найти раздел, действие или вопрос…",
      emptyTitle: "Ничего не найдено",
      emptyBody: "Попробуйте: Сегодня, блокеры, Weekly Review, песня, Мозг или контент.",
      navigate: "Навигация",
      create: "Создать",
      operate: "Работа",
      navHint: "Навигация",
      openHint: "Открыть",
      boundary: "Только навигация · без скрытых изменений"
    },
    today: {
      eyebrow: "ЕЖЕДНЕВНАЯ ОС",
      title: "Сегодня",
      description: "Что требует внимания прямо сейчас? Artist OS собирает текущее состояние в одно главное действие, короткую очередь внимания и понятное объяснение — почему именно это.",
      primary: "ГЛАВНОЕ",
      clear: "ВСЁ ЧИСТО",
      noBlockers: "Срочных блокеров нет",
      noBlockersBody: "В реализованных процессах нет нерешённых детерминированных задач. Artist OS не заполняет пустоту общими советами от ИИ.",
      createWithContext: "Создать с контекстом",
      next: "ДАЛЬШЕ",
      queue: "Очередь внимания",
      secondarySignal: "вторичный сигнал",
      secondarySignals: "вторичных сигналов",
      noSecondary: "Других задач, требующих внимания, сейчас нет.",
      lowerPriority: "сигнал с более низким приоритетом",
      lowerPriorityPlural: "сигналов с более низким приоритетом",
      notExpanded: "не показаны здесь.",
      context: "КОНТЕКСТ",
      whyHere: "Почему это здесь",
      contextAria: "Контекст главной рекомендации",
      whyHereBody: "Здесь показаны только прямые источники текущей рекомендации. Сам по себе недавний объект ещё не делает его релевантным.",
      memoryInUse: "ИСПОЛЬЗУЕМАЯ ПАМЯТЬ",
      workflowContext: "КОНТЕКСТ ПРОЦЕССА",
      blockedBy: "БЛОКИРУЕТСЯ",
      unresolved: "НЕ РАЗРЕШЕНО",
      noExtraRef: "Для этой детерминированной рекомендации не требуется дополнительных ссылок на сущности.",
      noPrimaryContext: "Сейчас нет главной рекомендации, поэтому Artist OS нечего показывать в её цепочке происхождения.",
      openMemory: "Открыть Память",
      openBrain: "Открыть Мозг",
      aligned: "Соответствует текущей цели",
      kind: {
        BLOCKER: "БЛОКЕР",
        NEXT_ACTION: "ДАЛЬШЕ",
        REVIEW: "ПРОВЕРИТЬ",
        MEMORY: "ПАМЯТЬ",
        FOUNDATION: "ОСНОВА",
        MUSIC: "МУЗЫКА"
      },
      signedOutEyebrow: "ТВОЯ КАРЬЕРА · ОДНА ОПЕРАЦИОННАЯ СИСТЕМА",
      signedOutTitle: "Понимай, что важно дальше.",
      signedOutBody: "Artist OS связывает идентичность, музыку, память и исполнение, чтобы каждое следующее решение начиналось с контекста, а не с пустого листа.",
      startHere: "НАЧАТЬ",
      establishWorkspace: "Создайте рабочее пространство артиста",
      establishWorkspaceBody: "Войдите или создайте аккаунт. Все будущие решения Artist OS будут храниться внутри вашего личного пространства артиста.",
      welcome: "ДОБРО ПОЖАЛОВАТЬ В ARTIST OS",
      createWorkspace: "Создайте рабочее пространство артиста.",
      createWorkspaceBody: "Для старта достаточно трёх вещей. Всё остальное система будет узнавать постепенно по мере вашей работы.",
      onboarding: "НАСТРОЙКА",
      noDevTools: "Без DevTools",
      noDevToolsBody: "Создайте каноническое пространство артиста, после чего Artist OS сможет постепенно строить Identity, Song Brain и память вокруг реальной работы.",
      createWorkspaceAction: "Создать пространство"
    },
    focus: {
      label: "ТЕКУЩИЙ ФОКУС",
      noPrimary: "Основной фокус пока не задан",
      noPrimaryBody: "Определите одну рабочую цель на текущий период. Когда она будет связана с конкретной работой, Today сможет использовать эту связь как ограниченный сигнал приоритета.",
      setCurrent: "Задать текущий фокус",
      currentPrimary: "ТЕКУЩИЙ ГЛАВНЫЙ ФОКУС",
      complete: "Завершить фокус",
      setLabel: "ЗАДАТЬ ТЕКУЩИЙ ФОКУС",
      whatMatters: "Что сейчас важнее всего?",
      helper: "Фокус должен быть рабочим и конкретным. Ручной фокус фиксирует ваше намерение; реальные связи с процессами позволяют Today учитывать его без скрытых догадок.",
      cancel: "Отмена",
      title: "Название фокуса",
      titlePlaceholder: "Например: создать импульс вокруг следующего релиза",
      success: "Как выглядит успех?",
      successPlaceholder: "Опишите рабочую цель одним-двумя предложениями.",
      starts: "Начало",
      ends: "Окончание",
      footer: "ГЛАВНЫЙ · УРОВЕНЬ АРТИСТА · ПОД КОНТРОЛЕМ ЧЕЛОВЕКА",
      saving: "Сохраняем…",
      set: "Задать фокус"
    },
    action: {
      start: "Начать",
      done: "Готово",
      block: "Заблокировать",
      resolve: "Снять блокировку",
      blockReason: "Причина блокировки",
      resolutionReason: "Причина разблокировки",
      blockPlaceholder: "Что мешает двигаться дальше?",
      resolutionPlaceholder: "Что изменилось?",
      confirmBlock: "Подтвердить блокировку",
      reopen: "Открыть снова",
      updateError: "Не удалось обновить действие."
    },
    why: {
      trigger: "Почему это?",
      triggerAria: "Почему эта рекомендация:",
      close: "Закрыть объяснение",
      back: "← Назад к объяснению",
      learn: "ИЗУЧИТЬ",
      whyThis: "ПОЧЕМУ ЭТО",
      contextualGuidance: "КОНТЕКСТНАЯ ПОДСКАЗКА",
      applyTo: "Применить к",
      ready: "ГОТОВО К ПРИМЕНЕНИЮ",
      applyNow: "Применить",
      returnRecommendation: "Вернуться к рекомендации",
      currentObjective: "Соответствует текущей цели",
      basedOn: "ОСНОВАНО НА",
      noRef: "Для этого детерминированного состояния не требуется дополнительной ссылки на сущность.",
      maturity: "ЗРЕЛОСТЬ ОСНОВАНИЯ",
      directRef: "прямая ссылка происхождения",
      directRefs: "прямых ссылок происхождения",
      uncertainty: "НЕОПРЕДЕЛЁННОСТЬ",
      lowUncertainty: "Низкая — рекомендация следует из текущего детерминированного состояния.",
      blockedBy: "БЛОКИРУЕТСЯ",
      expectedEffect: "ОЖИДАЕМЫЙ ЭФФЕКТ",
      expectedFallback: "Выполнение этого пункта устранит текущее состояние, требующее внимания.",
      learnOutcome: "ЧТО МЫ МОЖЕМ УЗНАТЬ",
      learnFallback: "Новый вывод здесь не предполагается — это рабочая задача или проверка готовности.",
      learnBefore: "ИЗУЧИТЬ ПЕРЕД ДЕЙСТВИЕМ",
      optional: "необязательно",
      unavailable: "Недоступно",
      unavailableTitle: "Для этой ссылки пока нет материала с подсказкой",
      maturityLabels: {
        FOUNDATION_CONTEXT: "БАЗОВЫЙ КОНТЕКСТ",
        CONTEXTUAL_STATE: "ТЕКУЩИЙ КОНТЕКСТ",
        WORKFLOW_EVIDENCE: "ДАННЫЕ ПРОЦЕССА",
        ARTIST_SPECIFIC_MEMORY: "ПАМЯТЬ АРТИСТА"
      },
      maturityDescriptions: {
        FOUNDATION_CONTEXT: "Для этой базовой детерминированной рекомендации пока не требуется дополнительная память конкретного артиста.",
        CONTEXTUAL_STATE: "Рекомендация использует явный текущий контекст, но не заявляет об использовании памяти артиста без реальной связи происхождения.",
        WORKFLOW_EVIDENCE: "Рекомендация основана на устойчивом состоянии уже идущей работы внутри Artist OS.",
        ARTIST_SPECIFIC_MEMORY: "Рекомендация напрямую ссылается на решения, выводы или доказательства конкретного артиста. Это описание происхождения, а не оценка качества."
      }
    }
  }
} as const;

export const getUiCopy = (locale: UiLocale) => uiCopy[locale];

const replaceKnownSystemText = (locale: UiLocale, value: string): string => {
  if (locale === "en") return value;
  const exact: Record<string, string> = {
    "Future recommendations need one canonical active Identity Version.": "Будущим рекомендациям нужна одна каноническая активная версия Identity.",
    "Gives future content and strategy work a canonical identity context.": "Даёт будущей работе с контентом и стратегией канонический контекст идентичности.",
    "This Content Unit exists but has no approved execution revision.": "Content Unit уже существует, но для него ещё нет утверждённой версии исполнения.",
    "Unlocks the unit's path toward execution readiness.": "Разблокирует путь Content Unit к готовности к исполнению.",
    "Approval does not create a Content Unit automatically.": "Утверждение идеи не создаёт Content Unit автоматически.",
    "Lets you choose which approved idea should enter production.": "Позволяет явно выбрать, какая утверждённая идея должна перейти в производство.",
    "Draft and deferred ideas remain proposals until you explicitly review them.": "Черновики и отложенные идеи остаются предложениями, пока вы явно их не проверите.",
    "Candidate knowledge stays outside permanent Artist Brain context until you review it.": "Кандидат в знания не входит в постоянный контекст Artist Brain, пока вы его не проверите.",
    "Keeps durable memory human-controlled.": "Сохраняет долговременный контекст под контролем человека.",
    "Song Brain gives future content and strategy decisions track-specific context.": "Song Brain даёт будущим решениям по контенту и стратегии контекст конкретной песни.",
    "This operational action is blocked and cannot progress without attention.": "Это рабочее действие заблокировано и не может двигаться дальше без вашего внимания.",
    "This operational action is active and still requires completion.": "Это рабочее действие активно и всё ещё требует завершения.",
    "Advances the linked workflow without changing source-domain truth by itself.": "Продвигает связанный процесс, не изменяя самостоятельно каноническое состояние исходного домена."
  };
  if (exact[value]) return exact[value]!;
  const objective = value.match(/^It directly supports the current (primary|secondary) objective: (.+)\.$/);
  if (objective) return `Это напрямую поддерживает текущую ${objective[1] === "primary" ? "основную" : "вторичную"} цель: ${objective[2]}.`;
  return value;
};

const localizeGuidance = (locale: UiLocale, guidance: AttentionGuidanceRef | undefined): AttentionGuidanceRef | undefined => {
  if (!guidance || locale === "en") return guidance;
  const labels: Record<string, string> = {
    "How editorial pitching works": "Как работает editorial pitching",
    "What an active Identity changes": "Что меняет активная Identity",
    "Turn a concept into shoot-ready execution": "Как превратить идею в готовый план съёмки",
    "From approved idea to production commitment": "От утверждённой идеи к производству",
    "How to judge a content angle": "Как оценивать контент-идею",
    "How to review a Brain candidate": "Как проверять кандидата в Artist Brain",
    "Build a useful Song Brain": "Как собрать полезный Song Brain"
  };
  return { ...guidance, label: labels[guidance.label] ?? guidance.label };
};

export const localizeAttentionItem = (locale: UiLocale, item: AttentionItem): AttentionItem => {
  if (locale === "en") return item;
  let title = item.title;
  title = title === "Activate your artist identity" ? "Активируйте идентичность артиста" : title;
  title = title === "Add your first song" ? "Добавьте первую песню" : title;
  title = title.replace(/^Finish execution · /, "Завершите подготовку · ");
  title = title.replace(/^(\d+) approved angles? waiting for commitment$/, (_, count) => `${count} утвержд. идей ждут решения о производстве`);
  title = title.replace(/^(\d+) content angles? need judgment$/, (_, count) => `${count} контент-идей ждут вашей оценки`);
  title = title.replace(/^(\d+) knowledge candidates? waiting$/, (_, count) => `${count} кандидатов в знания ждут проверки`);

  const actionLabels: Record<string, string> = {
    "Open Identity": "Открыть Identity",
    "Continue execution": "Продолжить подготовку",
    "Review approved angles": "Проверить утверждённые идеи",
    "Review angles": "Проверить идеи",
    "Review Brain inbox": "Открыть Inbox Artist Brain",
    "Add song": "Добавить песню",
    "Open action": "Открыть действие",
    "View action": "Открыть действие"
  };

  return {
    ...item,
    title,
    whyThis: item.whyThis.map((entry) => replaceKnownSystemText(locale, entry)),
    expectedEffect: item.expectedEffect ? replaceKnownSystemText(locale, item.expectedEffect) : undefined,
    whatWillBeLearned: item.whatWillBeLearned ? replaceKnownSystemText(locale, item.whatWillBeLearned) : undefined,
    guidanceRef: localizeGuidance(locale, item.guidanceRef),
    action: { ...item.action, label: actionLabels[item.action.label] ?? item.action.label }
  };
};


const entityTypeRu: Record<string, string> = {
  Decision: "Решение",
  Learning: "Вывод",
  WeeklyReview: "Недельный обзор",
  OperationalAction: "Действие",
  ContentUnit: "Контент-единица",
  ContentAngle: "Контент-идея",
  PlanningObjective: "Цель",
  CandidateKnowledge: "Кандидат в знания",
  IdentityVersion: "Версия Identity",
  ArtistIdentity: "Identity артиста",
  Song: "Песня"
};

export const localizeEntityType = (locale: UiLocale, type: string) =>
  locale === "ru" ? (entityTypeRu[type] ?? type) : type;
