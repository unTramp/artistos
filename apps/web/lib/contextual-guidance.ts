import type { Locale } from "./i18n";

export interface ContextualGuideSection {
  label: string;
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

const en: Record<string, ContextualGuide> = {
  "identity.active-context": {
    key: "identity.active-context", version: 1,
    title: "What an active Identity changes",
    summary: "Use Identity as decision context, not as a branding questionnaire you finish once.",
    estimatedMinutes: 4,
    outcome: "Activate one Identity Version that is specific enough to guide future creative choices.",
    sections: [
      { label: "WHAT IS THIS?", body: "The active Identity Version is the current creative context Artist OS can reuse when it evaluates songs, content and recommendations. It is a versioned point of view, not a permanent personality label." },
      { label: "WHY IT MATTERS", body: "Without an active Identity, later recommendations can only rely on generic context. A useful Identity makes trade-offs explicit while still allowing future versions when your direction changes." },
      { label: "HOW TO USE IT", body: "Prefer concrete creative constraints over aspirational adjectives.", bullets: ["Describe what should feel recognizably like you.", "Include boundaries that help reject attractive-but-wrong ideas.", "Activate only after the version reflects your current direction."] }
    ]
  },
  "music.song-brain": {
    key: "music.song-brain", version: 1,
    title: "Build a useful Song Brain",
    summary: "Capture song-specific meaning before asking the system to invent promotion around it.",
    estimatedMinutes: 5,
    outcome: "Add a song with enough truthful context to support track-specific content and strategy later.",
    sections: [
      { label: "WHAT IS THIS?", body: "Song Brain is the song-level context Artist OS can reuse across content, release and creative decisions. It should preserve what the track means and where its strongest usable moments are." },
      { label: "WHY IT MATTERS", body: "A song with no context pushes ideation toward generic best practices. Song-specific meaning creates better constraints and makes later recommendations explainable." },
      { label: "HOW TO USE IT", body: "Start with truth before optimization.", bullets: ["State the emotional or narrative core in plain language.", "Add only segments or claims you can actually support.", "Leave unknown fields unknown instead of filling them for completeness."] }
    ]
  },
  "brain.candidate-review": {
    key: "brain.candidate-review", version: 1,
    title: "Review a Brain candidate",
    summary: "Decide whether incoming context deserves to become reusable Artist Brain knowledge.",
    estimatedMinutes: 3,
    outcome: "Accept, merge or reject the candidate without turning weak evidence into durable truth.",
    sections: [
      { label: "WHAT IS THIS?", body: "Candidate Knowledge is proposed context waiting for human judgment. It stays outside durable Artist Brain context until you explicitly review it." },
      { label: "WHY IT MATTERS", body: "The value of memory depends on trust. Promoting every plausible statement would make future recommendations look confident while being built on uncertain context." },
      { label: "HOW TO USE IT", body: "Judge the candidate by evidence and scope, not by whether it sounds useful.", bullets: ["Accept when the statement is supported and reusable as written.", "Merge when it belongs inside an existing piece of knowledge.", "Reject when the claim is unsupported, duplicated or misleading."] }
    ]
  },
  "content.angle-review": {
    key: "content.angle-review", version: 1,
    title: "How to judge a content angle",
    summary: "Review the idea as a creative decision before spending production effort on it.",
    estimatedMinutes: 4,
    outcome: "Approve, defer or reject the angle with a reason Artist OS can preserve as evidence.",
    sections: [
      { label: "WHAT IS THIS?", body: "A Content Angle is a proposed creative direction. Approval means the concept is worth considering for production; it does not automatically create or schedule a Content Unit." },
      { label: "WHY IT MATTERS", body: "The review is where taste becomes usable context. A rejection reason such as NOT_ME or WRONG_TONE can later become evidence for a Learning or Decision candidate without another maintenance form." },
      { label: "HOW TO USE IT", body: "Make one clear judgment based on the current artist and song context.", bullets: ["Approve when the core idea is strong enough to deserve execution work.", "Defer when the idea may work but material context is missing.", "Reject with the closest real reason instead of a vague no."] }
    ]
  },
  "content.production-commitment": {
    key: "content.production-commitment", version: 1,
    title: "From approved idea to production commitment",
    summary: "Separate creative approval from the decision to spend real production effort.",
    estimatedMinutes: 3,
    outcome: "Create a Content Unit only for an approved angle you actually intend to move toward execution.",
    sections: [
      { label: "WHAT IS THIS?", body: "An approved Content Angle is still an idea. Creating a Content Unit is the explicit commitment that moves that idea into the production workflow." },
      { label: "WHY IT MATTERS", body: "Keeping approval separate from commitment prevents every good idea from becoming operational clutter and preserves the difference between taste and execution." },
      { label: "HOW TO USE IT", body: "Commit selectively.", bullets: ["Confirm the idea still serves the current focus.", "Check that the required effort is realistic now.", "Create the Content Unit when you are ready to define execution."] }
    ]
  },
  "content.execution-revision": {
    key: "content.execution-revision", version: 1,
    title: "Turn a concept into shoot-ready execution",
    summary: "Translate stable creative intent into a versioned execution plan without rewriting the original idea.",
    estimatedMinutes: 5,
    outcome: "Create and approve an execution revision that is concrete enough for the next production step.",
    sections: [
      { label: "WHAT IS THIS?", body: "A Content Unit keeps the production commitment stable while execution revisions hold the changeable instructions for how to make it." },
      { label: "WHY IT MATTERS", body: "Creative intent and production instructions evolve at different speeds. Versioned execution lets you refine the shoot without erasing why the content exists." },
      { label: "HOW TO USE IT", body: "Make the revision executable, not exhaustive.", bullets: ["Define the hook or opening beat.", "Specify the minimum shot/performance structure needed to execute.", "Approve only when another person — or future you — could act on it without guessing the core intent."] }
    ]
  },
  "music.editorial-pitch": {
    key: "music.editorial-pitch", version: 1,
    title: "How editorial pitching works",
    summary: "Prepare the context that helps a platform editor understand the release before you submit.",
    estimatedMinutes: 6,
    outcome: "Return to the pitch with a concise, truthful story and the release context required by the workflow.",
    sections: [
      { label: "WHAT IS THIS?", body: "An editorial pitch explains the release to the platform before it goes live. It is not a guarantee of placement and should not be treated as one." },
      { label: "WHY IT MATTERS", body: "Editors need usable context: what the song is, why it matters, who it may resonate with and what is happening around the release. Clear context is more useful than exaggerated claims." },
      { label: "HOW TO USE IT", body: "Write for comprehension, not hype.", bullets: ["Lead with the song and its distinctive story or sound.", "Add concrete release or audience context you can support.", "Submit before the workflow deadline and keep unsupported promises out of the pitch."] }
    ]
  }
};

const ru: Record<string, ContextualGuide> = {
  "identity.active-context": {
    key: "identity.active-context", version: 1,
    title: "Что меняет активная Идентичность",
    summary: "Используйте Идентичность как контекст для решений, а не как анкету по брендингу, которую нужно заполнить один раз.",
    estimatedMinutes: 4,
    outcome: "Активируйте одну Версию Идентичности, достаточно конкретную для будущих творческих решений.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Активная Версия Идентичности — это текущий творческий контекст, который Artist OS может повторно использовать при оценке песен, контента и рекомендаций. Это версионная точка зрения, а не постоянный ярлык личности." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Без активной Идентичности последующие рекомендации могут опираться только на общий контекст. Полезная Идентичность делает компромиссы явными и при этом допускает новые версии, когда направление меняется." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Предпочитайте конкретные творческие ограничения абстрактным прилагательным.", bullets: ["Опишите, что должно узнаваемо ощущаться вашим.", "Добавьте границы, которые помогают отвергать привлекательные, но неверные идеи.", "Активируйте версию только когда она отражает текущее направление."] }
    ]
  },
  "music.song-brain": {
    key: "music.song-brain", version: 1,
    title: "Соберите полезный Song Brain",
    summary: "Зафиксируйте смысл конкретной песни до того, как просить систему придумывать продвижение вокруг неё.",
    estimatedMinutes: 5,
    outcome: "Добавьте песню с достаточным правдивым контекстом для будущего контента и стратегии именно этого трека.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Song Brain — контекст уровня песни, который Artist OS может повторно использовать в контенте, релизных и творческих решениях. Он должен сохранять смысл трека и его сильнейшие применимые моменты." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Песня без контекста толкает идеи в сторону общих лучших практик. Смысл конкретной песни создаёт лучшие ограничения и делает будущие рекомендации объяснимыми." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Сначала правда, потом оптимизация.", bullets: ["Опишите эмоциональное или сюжетное ядро простыми словами.", "Добавляйте только те фрагменты и утверждения, которые действительно можете подтвердить.", "Оставляйте неизвестное неизвестным вместо заполнения ради полноты."] }
    ]
  },
  "brain.candidate-review": {
    key: "brain.candidate-review", version: 1,
    title: "Проверить кандидата в Artist Brain",
    summary: "Решите, заслуживает ли входящий контекст стать повторно используемым знанием Artist Brain.",
    estimatedMinutes: 3,
    outcome: "Примите, объедините или отклоните кандидата, не превращая слабое свидетельство в устойчивую истину.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Кандидат знания — это предложенный контекст, ожидающий человеческой оценки. Он остаётся вне устойчивого Artist Brain, пока вы явно не примете решение." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Ценность памяти зависит от доверия. Если продвигать каждое правдоподобное утверждение, будущие рекомендации будут выглядеть уверенно, оставаясь построенными на неопределённом контексте." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Оценивайте кандидата по доказательствам и области действия, а не по тому, насколько полезно он звучит.", bullets: ["Примите, если утверждение подтверждено и пригодно для повторного использования как есть.", "Объедините, если оно относится к уже существующему знанию.", "Отклоните, если утверждение не подтверждено, дублируется или вводит в заблуждение."] }
    ]
  },
  "content.angle-review": {
    key: "content.angle-review", version: 1,
    title: "Как оценить контент-идею",
    summary: "Оцените идею как творческое решение до того, как тратить ресурсы на производство.",
    estimatedMinutes: 4,
    outcome: "Одобрите, отложите или отклоните идею с причиной, которую Artist OS сможет сохранить как свидетельство.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Контент-идея — предложенное творческое направление. Одобрение означает, что концепцию стоит рассматривать для производства; оно не создаёт и не планирует Контент-юнит автоматически." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Именно в момент проверки вкус превращается в полезный контекст. Причина отклонения вроде NOT_ME или WRONG_TONE позже может стать свидетельством для кандидата в Вывод или Решение без дополнительной формы обслуживания." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Сделайте одно ясное суждение на основе текущего контекста артиста и песни.", bullets: ["Одобрите, если основная идея достаточно сильна, чтобы заслуживать работу над исполнением.", "Отложите, если идея может сработать, но не хватает важного контекста.", "Отклоните с наиболее близкой реальной причиной вместо неопределённого «нет»."] }
    ]
  },
  "content.production-commitment": {
    key: "content.production-commitment", version: 1,
    title: "От одобренной идеи к производственному обязательству",
    summary: "Разделяйте творческое одобрение и решение реально потратить производственные ресурсы.",
    estimatedMinutes: 3,
    outcome: "Создавайте Контент-юнит только для одобренной идеи, которую действительно намерены довести до исполнения.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Одобренная Контент-идея всё ещё остаётся идеей. Создание Контент-юнита — явное обязательство, которое переводит её в производственный процесс." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Разделение одобрения и обязательства не даёт каждой хорошей идее превратиться в операционный шум и сохраняет разницу между вкусом и исполнением." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Берите обязательства избирательно.", bullets: ["Убедитесь, что идея всё ещё поддерживает текущий фокус.", "Проверьте, реалистичны ли необходимые усилия сейчас.", "Создайте Контент-юнит, когда готовы определять исполнение."] }
    ]
  },
  "content.execution-revision": {
    key: "content.execution-revision", version: 1,
    title: "Превратите концепцию в готовое к съёмке исполнение",
    summary: "Переведите устойчивое творческое намерение в версионный план исполнения, не переписывая исходную идею.",
    estimatedMinutes: 5,
    outcome: "Создайте и одобрите ревизию исполнения, достаточно конкретную для следующего производственного шага.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Контент-юнит сохраняет производственное обязательство, а ревизии исполнения содержат изменяемые инструкции о том, как его реализовать." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Творческое намерение и производственные инструкции меняются с разной скоростью. Версионное исполнение позволяет улучшать съёмку, не стирая причину существования контента." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Делайте ревизию исполнимой, а не исчерпывающей.", bullets: ["Определите хук или первый бит.", "Зафиксируйте минимальную структуру кадра/перформанса, необходимую для реализации.", "Одобряйте только тогда, когда другой человек — или вы в будущем — сможет действовать без догадок о главном намерении."] }
    ]
  },
  "music.editorial-pitch": {
    key: "music.editorial-pitch", version: 1,
    title: "Как работает редакторский питч",
    summary: "Подготовьте контекст, который поможет редактору платформы понять релиз до отправки.",
    estimatedMinutes: 6,
    outcome: "Вернитесь к питчу с короткой правдивой историей и релизным контекстом, который требует процесс.",
    sections: [
      { label: "ЧТО ЭТО?", body: "Редакторский питч объясняет релиз платформе до выхода. Он не гарантирует плейсмент и не должен восприниматься как гарантия." },
      { label: "ПОЧЕМУ ЭТО ВАЖНО", body: "Редакторам нужен применимый контекст: что это за песня, почему она важна, кому может откликнуться и что происходит вокруг релиза. Ясный контекст полезнее преувеличенных заявлений." },
      { label: "КАК ИСПОЛЬЗОВАТЬ", body: "Пишите для понимания, а не ради хайпа.", bullets: ["Начните с песни и её отличительной истории или звучания.", "Добавьте конкретный релизный или аудиторный контекст, который можете подтвердить.", "Отправьте до дедлайна процесса и не включайте неподтверждённые обещания."] }
    ]
  }
};

export const getContextualGuide = (key: string, locale: Locale = "en") =>
  (locale === "ru" ? ru : en)[key] ?? null;
