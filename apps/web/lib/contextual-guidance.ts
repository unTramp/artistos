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

export const getContextualGuide = (key: string) => guides[key] ?? null;
