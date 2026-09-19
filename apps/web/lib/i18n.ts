export type Locale = "en" | "ru";

export const supportedLocales: Locale[] = ["en", "ru"];
export const localeCookieName = "artist-os-locale";

export const normalizeLocale = (value: string | null | undefined): Locale =>
  value?.toLowerCase().startsWith("ru") ? "ru" : "en";

export const uiCopy = {
  en: {
    shell: {
      workspace: "Artist Workspace",
      activeWorkspace: "Active workspace",
      authRequired: "Authentication required",
      learningLoop: "Learning loop active",
      learningLoopFlow: "Context → Action → Evidence → Learning → Better decision",
      contextReady: "Context Ready",
      signIn: "Sign in",
      primaryNav: "Primary",
      workspaceLabel: "Artist OS workspace",
      nav: { today: "Today", create: "Create", music: "Music", brain: "Brain", memory: "Memory", account: "Account" }
    },
    locale: { label: "Language", en: "EN", ru: "RU" },
    command: {
      open: "Open command palette",
      search: "Search or run command",
      searchPlaceholder: "Search pages, actions or questions…",
      close: "Close command palette",
      noMatch: "No matching command",
      noMatchHint: "Try Today, blockers, Weekly Review, song, Brain or content.",
      navigate: "Navigate", openAction: "Open", launcherOnly: "Launcher only · no hidden mutations",
      groups: { navigate: "Navigate", create: "Create", operate: "Operate" }
    },
    today: {
      eyebrow: "DAILY OS",
      title: "Today",
      description: "What needs attention now? Artist OS projects current canonical state into one primary action, a bounded attention queue and the provenance that explains why.",
      primary: "PRIMARY",
      labels: { blocker: "BLOCKED", next: "NEXT", review: "REVIEW", memory: "MEMORY", foundation: "FOUNDATION", music: "MUSIC", clear: "CLEAR" },
      aligned: "Aligned with current objective",
      noBlockers: "No immediate blockers",
      noBlockersBody: "Your implemented workflows have no unresolved deterministic attention item. Artist OS is not filling the gap with generic AI advice.",
      createWithContext: "Create with context",
      next: "NEXT",
      queue: "Attention queue",
      secondarySignal: "secondary signal",
      secondarySignals: "secondary signals",
      noSecondary: "No secondary attention items right now.",
      lowerPriority: "lower-priority signals not expanded here.",
      context: "CONTEXT",
      whyHere: "Why this is here",
      whyHereBody: "Only direct provenance from the current primary recommendation is shown here. Recency alone does not make something relevant.",
      memoryInUse: "MEMORY IN USE",
      workflowContext: "WORKFLOW CONTEXT",
      blockedBy: "BLOCKED BY",
      unresolved: "UNRESOLVED",
      noRef: "No additional entity reference is required for this deterministic recommendation.",
      noPrimaryProvenance: "No primary attention item is active, so Artist OS has no recommendation provenance to surface here.",
      openMemory: "Open Memory",
      openBrain: "Open Brain",
      contextAria: "Context for primary attention"
    },
    focus: {
      aria: "Current focus",
      current: "CURRENT FOCUS",
      noPrimary: "No primary focus yet",
      noPrimaryBody: "Define one operational focus for the current period. When it is linked to concrete work, Today can use that evidence as a bounded ranking signal.",
      setCurrent: "Set current focus",
      setHeading: "SET CURRENT FOCUS",
      whatMatters: "What matters most right now?",
      whatMattersBody: "Keep this operational. A manual focus records your intent; linked evidence from workflows can later make its effect on Today explicit.",
      cancel: "Cancel",
      title: "Focus title",
      titlePlaceholder: "e.g. Build momentum around the next release",
      success: "What does success look like?",
      successPlaceholder: "Describe the operational intent in one or two sentences.",
      starts: "Starts",
      ends: "Ends",
      footer: "PRIMARY · ARTIST-LEVEL · HUMAN-CONTROLLED",
      saving: "Saving…",
      set: "Set focus",
      completing: "Completing…",
      complete: "Complete focus",
      createError: "Current focus could not be created.",
      createTryAgain: "Current focus could not be created. Try again.",
      completeError: "Current focus could not be completed.",
      completeTryAgain: "Current focus could not be completed. Try again."
    },
    action: {
      start: "Start", done: "Done", block: "Block", resolve: "Resolve blocker",
      blockReason: "Block reason", resolutionReason: "Resolution reason",
      blockPlaceholder: "What is blocking this?", resolutionPlaceholder: "What changed?",
      confirmBlock: "Confirm block", reopen: "Reopen", updateError: "Action could not be updated."
    },
    why: {
      button: "Why this?", ariaPrefix: "Why this recommendation",
      close: "Close explanation", back: "← Back to why", learn: "LEARN", min: "MIN",
      whyThis: "WHY THIS", basedOn: "BASED ON", maturity: "BASIS MATURITY",
      uncertainty: "UNCERTAINTY", expected: "EXPECTED EFFECT", mayLearn: "WHAT WE MAY LEARN",
      contextualGuidance: "CONTEXTUAL GUIDANCE", applyTo: "Apply to", ready: "READY TO APPLY",
      applyNow: "Apply now", returnRecommendation: "Return to recommendation",
      currentObjective: "Current objective aligned", unresolved: "UNRESOLVED"
    }
  },
  ru: {
    shell: {
      workspace: "Рабочее пространство артиста",
      activeWorkspace: "Активное пространство",
      authRequired: "Требуется вход",
      learningLoop: "Цикл обучения активен",
      learningLoopFlow: "Контекст → Действие → Данные → Вывод → Лучшее решение",
      contextReady: "Контекст готов",
      signIn: "Войти",
      primaryNav: "Основная навигация",
      workspaceLabel: "Рабочее пространство Artist OS",
      nav: { today: "Сегодня", create: "Создать", music: "Музыка", brain: "Мозг", memory: "Память", account: "Аккаунт" }
    },
    locale: { label: "Язык", en: "EN", ru: "RU" },
    command: {
      open: "Открыть палитру команд",
      search: "Поиск или команда",
      searchPlaceholder: "Найти раздел, действие или вопрос…",
      close: "Закрыть палитру команд",
      noMatch: "Ничего не найдено",
      noMatchHint: "Попробуйте: Сегодня, блокеры, Недельный обзор, песня, Мозг или контент.",
      navigate: "Навигация", openAction: "Открыть", launcherOnly: "Только запуск · без скрытых изменений",
      groups: { navigate: "Навигация", create: "Создать", operate: "Работа" }
    },
    today: {
      eyebrow: "DAILY OS",
      title: "Сегодня",
      description: "Что требует внимания прямо сейчас? Artist OS собирает текущее состояние в одно главное действие, ограниченную очередь внимания и понятное объяснение — почему именно это.",
      primary: "ГЛАВНОЕ",
      labels: { blocker: "БЛОКЕР", next: "ДАЛЬШЕ", review: "ПРОВЕРИТЬ", memory: "ПАМЯТЬ", foundation: "ОСНОВА", music: "МУЗЫКА", clear: "ЧИСТО" },
      aligned: "Связано с текущим фокусом",
      noBlockers: "Срочных блокеров нет",
      noBlockersBody: "В текущих рабочих процессах нет нерешённых детерминированных сигналов внимания. Artist OS не заполняет пустоту случайными AI-советами.",
      createWithContext: "Создать с контекстом",
      next: "ДАЛЬШЕ",
      queue: "Очередь внимания",
      secondarySignal: "вторичный сигнал",
      secondarySignals: "вторичных сигналов",
      noSecondary: "Сейчас нет дополнительных сигналов внимания.",
      lowerPriority: "сигналов более низкого приоритета скрыто.",
      context: "КОНТЕКСТ",
      whyHere: "Почему это здесь",
      whyHereBody: "Здесь показаны только прямые источники текущей рекомендации. То, что что-то произошло недавно, само по себе не делает это релевантным.",
      memoryInUse: "ИСПОЛЬЗУЕМАЯ ПАМЯТЬ",
      workflowContext: "КОНТЕКСТ РАБОТЫ",
      blockedBy: "ЗАБЛОКИРОВАНО",
      unresolved: "НЕ РАЗРЕШЕНО",
      noRef: "Для этой детерминированной рекомендации дополнительные ссылки на сущности не требуются.",
      noPrimaryProvenance: "Сейчас нет главного сигнала внимания, поэтому Artist OS не показывает искусственный контекст рекомендации.",
      openMemory: "Открыть Память",
      openBrain: "Открыть Мозг",
      contextAria: "Контекст главной рекомендации"
    },
    focus: {
      aria: "Текущий фокус",
      current: "ТЕКУЩИЙ ФОКУС",
      noPrimary: "Главный фокус пока не задан",
      noPrimaryBody: "Определите один операционный фокус на текущий период. Когда он связан с реальной работой, Today сможет использовать эту связь как ограниченный сигнал приоритета.",
      setCurrent: "Задать текущий фокус",
      setHeading: "ЗАДАТЬ ТЕКУЩИЙ ФОКУС",
      whatMatters: "Что сейчас важнее всего?",
      whatMattersBody: "Формулируйте операционно. Ручной фокус фиксирует ваше намерение; связанные данные из рабочих процессов позже могут сделать его влияние на Today явным.",
      cancel: "Отмена",
      title: "Название фокуса",
      titlePlaceholder: "Например: создать импульс вокруг следующего релиза",
      success: "Как выглядит успех?",
      successPlaceholder: "Опишите операционную цель одним-двумя предложениями.",
      starts: "Начало",
      ends: "Окончание",
      footer: "ГЛАВНЫЙ · УРОВЕНЬ АРТИСТА · ПОД КОНТРОЛЕМ ЧЕЛОВЕКА",
      saving: "Сохраняю…",
      set: "Задать фокус",
      completing: "Завершаю…",
      complete: "Завершить фокус",
      createError: "Не удалось создать текущий фокус.",
      createTryAgain: "Не удалось создать текущий фокус. Попробуйте ещё раз.",
      completeError: "Не удалось завершить текущий фокус.",
      completeTryAgain: "Не удалось завершить текущий фокус. Попробуйте ещё раз."
    },
    action: {
      start: "Начать", done: "Готово", block: "Заблокировать", resolve: "Снять блокер",
      blockReason: "Причина блокировки", resolutionReason: "Что изменилось",
      blockPlaceholder: "Что мешает выполнить это действие?", resolutionPlaceholder: "Что изменилось?",
      confirmBlock: "Подтвердить блокировку", reopen: "Вернуть в работу", updateError: "Не удалось обновить действие."
    },
    why: {
      button: "Почему это?", ariaPrefix: "Почему эта рекомендация",
      close: "Закрыть объяснение", back: "← Назад к объяснению", learn: "РАЗОБРАТЬСЯ", min: "МИН",
      whyThis: "ПОЧЕМУ ЭТО", basedOn: "НА ЧЁМ ОСНОВАНО", maturity: "ЗРЕЛОСТЬ ОСНОВАНИЯ",
      uncertainty: "НЕОПРЕДЕЛЁННОСТЬ", expected: "ОЖИДАЕМЫЙ ЭФФЕКТ", mayLearn: "ЧТО МЫ МОЖЕМ УЗНАТЬ",
      contextualGuidance: "КОНТЕКСТНАЯ ПОДСКАЗКА", applyTo: "Применить к", ready: "ГОТОВО К ПРИМЕНЕНИЮ",
      applyNow: "Применить сейчас", returnRecommendation: "Вернуться к рекомендации",
      currentObjective: "Связано с текущей целью", unresolved: "НЕ РАЗРЕШЕНО"
    }
  }
} as const;

export const getUiCopy = (locale: Locale) => uiCopy[locale];
