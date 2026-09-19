import type { UiLocale } from "./i18n";

export interface ContextualGuideSection {
  label: "WHAT IS THIS?" | "WHY IT MATTERS" | "HOW TO USE IT";
  body: string;
  bullets?: string[];
}

export interface ContextualGuide {
  key: string;
  version: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  outcome: string;
  sections: ContextualGuideSection[];
}

const guides: Record<string, ContextualGuide> = {
  "identity.active-context": {
    key: "identity.active-context",
    version: 1,
    title: "What an active Identity changes",
    summary: "Use Identity as decision context, not as a branding questionnaire you finish once.",
    estimatedMinutes: 4,
    outcome: "Activate one Identity Version that is specific enough to guide future creative choices.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "The active Identity Version is the current creative context Artist OS can reuse when it evaluates songs, content and recommendations. It is a versioned point of view, not a permanent personality label."
      },
      {
        label: "WHY IT MATTERS",
        body: "Without an active Identity, later recommendations can only rely on generic context. A useful Identity makes trade-offs explicit while still allowing future versions when your direction changes."
      },
      {
        label: "HOW TO USE IT",
        body: "Prefer concrete creative constraints over aspirational adjectives.",
        bullets: [
          "Describe what should feel recognizably like you.",
          "Include boundaries that help reject attractive-but-wrong ideas.",
          "Activate only after the version reflects your current direction."
        ]
      }
    ]
  },
  "music.song-brain": {
    key: "music.song-brain",
    version: 1,
    title: "Build a useful Song Brain",
    summary: "Capture song-specific meaning before asking the system to invent promotion around it.",
    estimatedMinutes: 5,
    outcome: "Add a song with enough truthful context to support track-specific content and strategy later.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "Song Brain is the song-level context Artist OS can reuse across content, release and creative decisions. It should preserve what the track means and where its strongest usable moments are."
      },
      {
        label: "WHY IT MATTERS",
        body: "A song with no context pushes ideation toward generic best practices. Song-specific meaning creates better constraints and makes later recommendations explainable."
      },
      {
        label: "HOW TO USE IT",
        body: "Start with truth before optimization.",
        bullets: [
          "State the emotional or narrative core in plain language.",
          "Add only segments or claims you can actually support.",
          "Leave unknown fields unknown instead of filling them for completeness."
        ]
      }
    ]
  },
  "brain.candidate-review": {
    key: "brain.candidate-review",
    version: 1,
    title: "Review a Brain candidate",
    summary: "Decide whether incoming context deserves to become reusable Artist Brain knowledge.",
    estimatedMinutes: 3,
    outcome: "Accept, merge or reject the candidate without turning weak evidence into durable truth.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "Candidate Knowledge is proposed context waiting for human judgment. It stays outside durable Artist Brain context until you explicitly review it."
      },
      {
        label: "WHY IT MATTERS",
        body: "The value of memory depends on trust. Promoting every plausible statement would make future recommendations look confident while being built on uncertain context."
      },
      {
        label: "HOW TO USE IT",
        body: "Judge the candidate by evidence and scope, not by whether it sounds useful.",
        bullets: [
          "Accept when the statement is supported and reusable as written.",
          "Merge when it belongs inside an existing piece of knowledge.",
          "Reject when the claim is unsupported, duplicated or misleading."
        ]
      }
    ]
  },
  "content.angle-review": {
    key: "content.angle-review",
    version: 1,
    title: "How to judge a content angle",
    summary: "Review the idea as a creative decision before spending production effort on it.",
    estimatedMinutes: 4,
    outcome: "Approve, defer or reject the angle with a reason Artist OS can preserve as evidence.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "A Content Angle is a proposed creative direction. Approval means the concept is worth considering for production; it does not automatically create or schedule a Content Unit."
      },
      {
        label: "WHY IT MATTERS",
        body: "The review is where taste becomes usable context. A rejection reason such as NOT_ME or WRONG_TONE can later become evidence for a Learning or Decision candidate without another maintenance form."
      },
      {
        label: "HOW TO USE IT",
        body: "Make one clear judgment based on the current artist and song context.",
        bullets: [
          "Approve when the core idea is strong enough to deserve execution work.",
          "Defer when the idea may work but material context is missing.",
          "Reject with the closest real reason instead of a vague no."
        ]
      }
    ]
  },
  "content.production-commitment": {
    key: "content.production-commitment",
    version: 1,
    title: "From approved idea to production commitment",
    summary: "Separate creative approval from the decision to spend real production effort.",
    estimatedMinutes: 3,
    outcome: "Create a Content Unit only for an approved angle you actually intend to move toward execution.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "An approved Content Angle is still an idea. Creating a Content Unit is the explicit commitment that moves that idea into the production workflow."
      },
      {
        label: "WHY IT MATTERS",
        body: "Keeping approval separate from commitment prevents every good idea from becoming operational clutter and preserves the difference between taste and execution."
      },
      {
        label: "HOW TO USE IT",
        body: "Commit selectively.",
        bullets: [
          "Confirm the idea still serves the current focus.",
          "Check that the required effort is realistic now.",
          "Create the Content Unit when you are ready to define execution."
        ]
      }
    ]
  },
  "content.execution-revision": {
    key: "content.execution-revision",
    version: 1,
    title: "Turn a concept into shoot-ready execution",
    summary: "Translate stable creative intent into a versioned execution plan without rewriting the original idea.",
    estimatedMinutes: 5,
    outcome: "Create and approve an execution revision that is concrete enough for the next production step.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "A Content Unit keeps the production commitment stable while execution revisions hold the changeable instructions for how to make it."
      },
      {
        label: "WHY IT MATTERS",
        body: "Creative intent and production instructions evolve at different speeds. Versioned execution lets you refine the shoot without erasing why the content exists."
      },
      {
        label: "HOW TO USE IT",
        body: "Make the revision executable, not exhaustive.",
        bullets: [
          "Define the hook or opening beat.",
          "Specify the minimum shot/performance structure needed to execute.",
          "Approve only when another person — or future you — could act on it without guessing the core intent."
        ]
      }
    ]
  },
  "music.editorial-pitch": {
    key: "music.editorial-pitch",
    version: 1,
    title: "How editorial pitching works",
    summary: "Prepare the context that helps a platform editor understand the release before you submit.",
    estimatedMinutes: 6,
    outcome: "Return to the pitch with a concise, truthful story and the release context required by the workflow.",
    sections: [
      {
        label: "WHAT IS THIS?",
        body: "An editorial pitch explains the release to the platform before it goes live. It is not a guarantee of placement and should not be treated as one."
      },
      {
        label: "WHY IT MATTERS",
        body: "Editors need usable context: what the song is, why it matters, who it may resonate with and what is happening around the release. Clear context is more useful than exaggerated claims."
      },
      {
        label: "HOW TO USE IT",
        body: "Write for comprehension, not hype.",
        bullets: [
          "Lead with the song and its distinctive story or sound.",
          "Add concrete release or audience context you can support.",
          "Submit before the workflow deadline and keep unsupported promises out of the pitch."
        ]
      }
    ]
  }
};

const ruSectionLabel: Record<ContextualGuideSection["label"], ContextualGuideSection["label"] | string> = {
  "WHAT IS THIS?": "ЧТО ЭТО?",
  "WHY IT MATTERS": "ПОЧЕМУ ЭТО ВАЖНО",
  "HOW TO USE IT": "КАК ИСПОЛЬЗОВАТЬ"
};

const ruText: Record<string, string> = {
  "What an active Identity changes": "Что меняет активная Identity",
  "Use Identity as decision context, not as a branding questionnaire you finish once.": "Используйте Identity как контекст для решений, а не как анкету по брендингу, которую заполняют один раз.",
  "Activate one Identity Version that is specific enough to guide future creative choices.": "Активируйте одну версию Identity, достаточно конкретную, чтобы она помогала принимать будущие творческие решения.",
  "The active Identity Version is the current creative context Artist OS can reuse when it evaluates songs, content and recommendations. It is a versioned point of view, not a permanent personality label.": "Активная версия Identity — это текущий творческий контекст, который Artist OS может повторно использовать при работе с песнями, контентом и рекомендациями. Это версионируемая точка зрения, а не вечный ярлык личности.",
  "Without an active Identity, later recommendations can only rely on generic context. A useful Identity makes trade-offs explicit while still allowing future versions when your direction changes.": "Без активной Identity будущие рекомендации могут опираться только на общий контекст. Полезная Identity делает компромиссы явными и при этом позволяет создавать новые версии, когда направление меняется.",
  "Prefer concrete creative constraints over aspirational adjectives.": "Предпочитайте конкретные творческие ограничения абстрактным эпитетам.",
  "Describe what should feel recognizably like you.": "Опишите, что должно ощущаться узнаваемо вашим.",
  "Include boundaries that help reject attractive-but-wrong ideas.": "Добавьте границы, которые помогают отклонять привлекательные, но неподходящие идеи.",
  "Activate only after the version reflects your current direction.": "Активируйте версию только тогда, когда она действительно отражает ваше текущее направление.",

  "Build a useful Song Brain": "Соберите полезный Song Brain",
  "Capture song-specific meaning before asking the system to invent promotion around it.": "Зафиксируйте смысл конкретной песни до того, как просить систему строить вокруг неё продвижение.",
  "Add a song with enough truthful context to support track-specific content and strategy later.": "Добавьте песню с достаточным правдивым контекстом, чтобы позже опираться на него в контенте и стратегии.",
  "Song Brain is the song-level context Artist OS can reuse across content, release and creative decisions. It should preserve what the track means and where its strongest usable moments are.": "Song Brain — это контекст уровня песни, который Artist OS может повторно использовать в контенте, релизах и творческих решениях. Он должен сохранять смысл трека и его самые сильные применимые моменты.",
  "A song with no context pushes ideation toward generic best practices. Song-specific meaning creates better constraints and makes later recommendations explainable.": "Песня без контекста толкает идеи к общим практикам. Смысл конкретной песни создаёт лучшие ограничения и делает будущие рекомендации объяснимыми.",
  "Start with truth before optimization.": "Начинайте с правды, а не с оптимизации.",
  "State the emotional or narrative core in plain language.": "Опишите эмоциональное или сюжетное ядро простыми словами.",
  "Add only segments or claims you can actually support.": "Добавляйте только те сегменты и утверждения, которые действительно можете подтвердить.",
  "Leave unknown fields unknown instead of filling them for completeness.": "Оставляйте неизвестные поля неизвестными вместо заполнения ради полноты.",

  "Review a Brain candidate": "Проверьте кандидата в Artist Brain",
  "Decide whether incoming context deserves to become reusable Artist Brain knowledge.": "Решите, достоин ли новый контекст стать переиспользуемым знанием Artist Brain.",
  "Accept, merge or reject the candidate without turning weak evidence into durable truth.": "Примите, объедините или отклоните кандидата, не превращая слабое основание в долговременную истину.",
  "Candidate Knowledge is proposed context waiting for human judgment. It stays outside durable Artist Brain context until you explicitly review it.": "Candidate Knowledge — это предложенный контекст, ожидающий человеческого решения. Он остаётся вне долговременного Artist Brain, пока вы явно его не проверите.",
  "The value of memory depends on trust. Promoting every plausible statement would make future recommendations look confident while being built on uncertain context.": "Ценность памяти зависит от доверия. Если продвигать каждое правдоподобное утверждение, будущие рекомендации будут выглядеть уверенными, оставаясь построенными на сомнительном контексте.",
  "Judge the candidate by evidence and scope, not by whether it sounds useful.": "Оценивайте кандидата по основаниям и области применимости, а не по тому, насколько полезно он звучит.",
  "Accept when the statement is supported and reusable as written.": "Принимайте, когда утверждение подтверждено и пригодно к повторному использованию в текущем виде.",
  "Merge when it belongs inside an existing piece of knowledge.": "Объединяйте, когда утверждение относится к уже существующему знанию.",
  "Reject when the claim is unsupported, duplicated or misleading.": "Отклоняйте, когда утверждение не подтверждено, дублируется или вводит в заблуждение.",

  "How to judge a content angle": "Как оценивать контент-идею",
  "Review the idea as a creative decision before spending production effort on it.": "Оцените идею как творческое решение до того, как тратить на неё производственные ресурсы.",
  "Approve, defer or reject the angle with a reason Artist OS can preserve as evidence.": "Утвердите, отложите или отклоните идею с причиной, которую Artist OS сможет сохранить как основание.",
  "A Content Angle is a proposed creative direction. Approval means the concept is worth considering for production; it does not automatically create or schedule a Content Unit.": "Content Angle — предложенное творческое направление. Утверждение означает, что концепцию стоит рассматривать для производства; оно не создаёт и не планирует Content Unit автоматически.",
  "The review is where taste becomes usable context. A rejection reason such as NOT_ME or WRONG_TONE can later become evidence for a Learning or Decision candidate without another maintenance form.": "На этапе проверки вкус превращается в полезный контекст. Причина отказа вроде NOT_ME или WRONG_TONE позже может стать основанием для Learning или Decision без дополнительной анкеты.",
  "Make one clear judgment based on the current artist and song context.": "Примите одно ясное решение на основе текущего контекста артиста и песни.",
  "Approve when the core idea is strong enough to deserve execution work.": "Утверждайте, когда ядро идеи достаточно сильное, чтобы тратить силы на исполнение.",
  "Defer when the idea may work but material context is missing.": "Откладывайте, когда идея может сработать, но не хватает важного контекста.",
  "Reject with the closest real reason instead of a vague no.": "Отклоняйте с максимально точной реальной причиной вместо неопределённого «нет».",

  "From approved idea to production commitment": "От утверждённой идеи к производству",
  "Separate creative approval from the decision to spend real production effort.": "Отделяйте творческое одобрение от решения потратить реальные производственные ресурсы.",
  "Create a Content Unit only for an approved angle you actually intend to move toward execution.": "Создавайте Content Unit только для утверждённой идеи, которую действительно собираетесь довести до исполнения.",
  "An approved Content Angle is still an idea. Creating a Content Unit is the explicit commitment that moves that idea into the production workflow.": "Утверждённый Content Angle всё ещё остаётся идеей. Создание Content Unit — это явное обязательство, переводящее идею в производственный процесс.",
  "Keeping approval separate from commitment prevents every good idea from becoming operational clutter and preserves the difference between taste and execution.": "Разделение одобрения и обязательства не позволяет каждой хорошей идее превращаться в операционный шум и сохраняет разницу между вкусом и исполнением.",
  "Commit selectively.": "Берите в производство выборочно.",
  "Confirm the idea still serves the current focus.": "Убедитесь, что идея всё ещё поддерживает текущий фокус.",
  "Check that the required effort is realistic now.": "Проверьте, что требуемые усилия реалистичны прямо сейчас.",
  "Create the Content Unit when you are ready to define execution.": "Создавайте Content Unit, когда готовы определить исполнение.",

  "Turn a concept into shoot-ready execution": "Превратите концепцию в готовый план съёмки",
  "Translate stable creative intent into a versioned execution plan without rewriting the original idea.": "Переведите устойчивый творческий замысел в версионируемый план исполнения, не переписывая исходную идею.",
  "Create and approve an execution revision that is concrete enough for the next production step.": "Создайте и утвердите версию исполнения, достаточно конкретную для следующего производственного шага.",
  "A Content Unit keeps the production commitment stable while execution revisions hold the changeable instructions for how to make it.": "Content Unit сохраняет устойчивым само производственное обязательство, а версии исполнения содержат изменяемые инструкции о том, как его реализовать.",
  "Creative intent and production instructions evolve at different speeds. Versioned execution lets you refine the shoot without erasing why the content exists.": "Творческий замысел и производственные инструкции меняются с разной скоростью. Версионирование позволяет улучшать съёмку, не стирая причину существования контента.",
  "Make the revision executable, not exhaustive.": "Делайте версию исполнимой, а не исчерпывающей.",
  "Define the hook or opening beat.": "Определите хук или первое действие.",
  "Specify the minimum shot/performance structure needed to execute.": "Задайте минимальную структуру кадров или выступления, достаточную для исполнения.",
  "Approve only when another person — or future you — could act on it without guessing the core intent.": "Утверждайте только тогда, когда другой человек — или вы сами позже — сможет выполнить план без догадок о главном замысле.",

  "How editorial pitching works": "Как работает editorial pitching",
  "Prepare the context that helps a platform editor understand the release before you submit.": "Подготовьте контекст, который поможет редактору платформы понять релиз до отправки pitch.",
  "Return to the pitch with a concise, truthful story and the release context required by the workflow.": "Вернитесь к pitch с краткой правдивой историей и необходимым контекстом релиза.",
  "An editorial pitch explains the release to the platform before it goes live. It is not a guarantee of placement and should not be treated as one.": "Editorial pitch объясняет платформе релиз до его выхода. Это не гарантия размещения и не должен восприниматься как таковая.",
  "Editors need usable context: what the song is, why it matters, who it may resonate with and what is happening around the release. Clear context is more useful than exaggerated claims.": "Редакторам нужен применимый контекст: что это за песня, почему она важна, кому может откликнуться и что происходит вокруг релиза. Ясный контекст полезнее преувеличений.",
  "Write for comprehension, not hype.": "Пишите для понимания, а не ради хайпа.",
  "Lead with the song and its distinctive story or sound.": "Начните с песни и её отличительной истории или звучания.",
  "Add concrete release or audience context you can support.": "Добавьте конкретный контекст релиза или аудитории, который можете подтвердить.",
  "Submit before the workflow deadline and keep unsupported promises out of the pitch.": "Отправьте pitch до дедлайна процесса и не добавляйте неподтверждённых обещаний."
};

const localizeGuide = (guide: ContextualGuide, locale: UiLocale): ContextualGuide => {
  if (locale === "en") return guide;
  return {
    ...guide,
    title: ruText[guide.title] ?? guide.title,
    summary: ruText[guide.summary] ?? guide.summary,
    outcome: ruText[guide.outcome] ?? guide.outcome,
    sections: guide.sections.map((section) => ({
      ...section,
      label: ruSectionLabel[section.label] as ContextualGuideSection["label"],
      body: ruText[section.body] ?? section.body,
      ...(section.bullets ? { bullets: section.bullets.map((bullet) => ruText[bullet] ?? bullet) } : {})
    }))
  };
};

export const getContextualGuide = (key: string, locale: UiLocale = "en") => {
  const guide = guides[key];
  return guide ? localizeGuide(guide, locale) : null;
};
