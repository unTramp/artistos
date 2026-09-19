"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import { getUiCopy, type UiLocale } from "@/lib/i18n";
import { useModalFocusTrap } from "./ui/use-modal-focus-trap";

type CommandGroup = "Navigate" | "Create" | "Operate";
type PaletteCommand = {
  id: string;
  label: string;
  description: string;
  group: CommandGroup;
  href: string;
  keywords: string[];
};

const commandsFor = (locale: UiLocale): PaletteCommand[] => locale === "ru" ? [
  { id: "today", label: "Сегодня", description: "Текущий фокус, главное действие и блокеры", group: "Navigate", href: "/", keywords: ["сегодня", "внимание", "дальше"] },
  { id: "create", label: "Создать", description: "Открыть Content Factory", group: "Navigate", href: "/factory", keywords: ["контент", "фабрика", "идеи"] },
  { id: "music", label: "Музыка", description: "Песни и Song Brain", group: "Navigate", href: "/songs", keywords: ["песня", "трек", "музыка"] },
  { id: "brain", label: "Мозг", description: "Текущий контекст артиста и Inbox знаний", group: "Navigate", href: "/knowledge", keywords: ["мозг", "знания", "контекст"] },
  { id: "memory", label: "Память", description: "Решения, выводы и история Weekly Review", group: "Navigate", href: "/memory", keywords: ["память", "решение", "вывод"] },
  { id: "decisions", label: "Решения", description: "Материальные решения и причины", group: "Navigate", href: "/decisions", keywords: ["решение", "почему", "история"] },
  { id: "learnings", label: "Выводы", description: "Проверенные и кандидатные Learnings", group: "Navigate", href: "/learnings", keywords: ["вывод", "learning", "доказательства"] },
  { id: "weekly-review", label: "Weekly Review", description: "Превратить неделю в решения и действия", group: "Navigate", href: "/weekly-reviews", keywords: ["неделя", "обзор", "review"] },
  { id: "identity", label: "Identity артиста", description: "Канонический контекст идентичности артиста", group: "Navigate", href: "/identity", keywords: ["identity", "образ", "артист"] },
  { id: "add-song", label: "Добавить песню", description: "Перейти в Музыку и добавить песню", group: "Create", href: "/songs", keywords: ["новая", "трек", "песня"] },
  { id: "create-angle", label: "Создать контент-идею", description: "Начать лёгкий черновик в Factory", group: "Create", href: "/factory", keywords: ["идея", "контент", "angle"] },
  { id: "what-next", label: "Что мне делать дальше?", description: "Вернуться к детерминированным приоритетам Today", group: "Operate", href: "/", keywords: ["дальше", "приоритет", "фокус"] },
  { id: "show-blockers", label: "Показать блокеры", description: "Открыть Today, где блокеры получают высокий приоритет", group: "Operate", href: "/", keywords: ["блокер", "заблокировано"] },
  { id: "run-weekly-review", label: "Запустить Weekly Review", description: "Создать неизменяемый недельный снимок решений", group: "Operate", href: "/weekly-reviews", keywords: ["review", "неделя", "обзор"] }
] : [
  { id: "today", label: "Today", description: "Open current focus, next action and blockers", group: "Navigate", href: "/", keywords: ["home", "attention", "next"] },
  { id: "create", label: "Create", description: "Open Content Factory", group: "Navigate", href: "/factory", keywords: ["content", "factory", "angles"] },
  { id: "music", label: "Music", description: "Open songs and Song Brain", group: "Navigate", href: "/songs", keywords: ["song", "track", "brain"] },
  { id: "brain", label: "Brain", description: "Open current artist context and knowledge inbox", group: "Navigate", href: "/knowledge", keywords: ["knowledge", "context", "rules", "inbox"] },
  { id: "memory", label: "Memory", description: "Open decisions, learnings and review history", group: "Navigate", href: "/memory", keywords: ["memory", "decision", "learning", "review", "history"] },
  { id: "decisions", label: "Decision Memory", description: "Review material choices and rationale", group: "Navigate", href: "/decisions", keywords: ["decision", "why", "history"] },
  { id: "learnings", label: "Learning Memory", description: "Review validated and candidate Learnings", group: "Navigate", href: "/learnings", keywords: ["learning", "evidence", "validated"] },
  { id: "weekly-review", label: "Weekly Review", description: "Turn the week into decisions and actions", group: "Navigate", href: "/weekly-reviews", keywords: ["review", "week", "ritual"] },
  { id: "identity", label: "Artist Identity", description: "Open canonical artist identity context", group: "Navigate", href: "/identity", keywords: ["identity", "brand", "artist"] },
  { id: "add-song", label: "Add song", description: "Go to Music to add a song", group: "Create", href: "/songs", keywords: ["new", "track", "song"] },
  { id: "create-angle", label: "Create content angle", description: "Start a lightweight Factory draft", group: "Create", href: "/factory", keywords: ["idea", "content", "angle", "draft"] },
  { id: "what-next", label: "What should I do next?", description: "Return to deterministic Today priorities", group: "Operate", href: "/", keywords: ["next", "priority", "focus", "today"] },
  { id: "show-blockers", label: "Show blockers", description: "Open Today where blockers are ranked first", group: "Operate", href: "/", keywords: ["blocked", "blocker", "attention"] },
  { id: "run-weekly-review", label: "Run Weekly Review", description: "Generate an immutable weekly decision snapshot", group: "Operate", href: "/weekly-reviews", keywords: ["generate", "review", "week"] }
];

const normalize = (value: string) => value.trim().toLowerCase();

export function CommandPalette({ locale }: { locale: UiLocale }) {
  const copy = getUiCopy(locale);
  const commands = useMemo(() => commandsFor(locale), [locale]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const term = normalize(query);
    if (!term) return commands;
    return commands.filter((command) => normalize([
      command.label, command.description, command.group, ...command.keywords
    ].join(" ")).includes(term));
  }, [commands, query]);

  const openPalette = useCallback((source: "button" | "shortcut") => {
    setOpen(true);
    emitProductTelemetry({ eventName: "COMMAND_PALETTE_OPENED", surface: "Global", entityType: "CommandPalette", metadata: { source } });
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useModalFocusTrap({ open, containerRef: dialogRef, initialFocusRef: inputRef, restoreFocusRef: triggerRef, onEscape: closePalette });

  const execute = (command: PaletteCommand) => {
    emitProductTelemetry({
      eventName: "COMMAND_PALETTE_EXECUTED",
      surface: "Global",
      entityType: "CommandPalette",
      entityId: command.id,
      metadata: { group: command.group, queryUsed: Boolean(query.trim()) }
    });
    window.location.assign(command.href);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) closePalette(); else openPalette("shortcut");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePalette, open, openPalette]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [activeIndex, filtered.length]);

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => filtered.length ? (index + 1) % filtered.length : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => filtered.length ? (index - 1 + filtered.length) % filtered.length : 0);
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      execute(filtered[activeIndex]);
    }
  };

  const groupLabel = (group: CommandGroup) =>
    group === "Navigate" ? copy.command.navigate : group === "Create" ? copy.command.create : copy.command.operate;

  return (
    <>
      <button
        ref={triggerRef}
        className="command-shell"
        type="button"
        onClick={() => openPalette("button")}
        aria-label={copy.command.open}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <p>{copy.command.search}</p>
        <span>⌘K</span>
      </button>

      {open && (
        <div className="palette-layer" role="presentation">
          <button className="palette-backdrop" type="button" aria-label={copy.why.close} onClick={closePalette} />
          <section
            ref={dialogRef}
            className="command-palette ui-dialog-surface"
            role="dialog"
            aria-modal="true"
            aria-label={copy.command.open}
            tabIndex={-1}
          >
            <header className="palette-search-row">
              <span className="palette-search-icon" aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                onKeyDown={onInputKeyDown}
                placeholder={copy.command.placeholder}
                aria-label={copy.command.searchAria}
                aria-controls="command-palette-results"
              />
              <kbd>ESC</kbd>
            </header>

            <div className="palette-results" id="command-palette-results">
              {filtered.length === 0 ? (
                <div className="palette-empty">
                  <strong>{copy.command.emptyTitle}</strong>
                  <span>{copy.command.emptyBody}</span>
                </div>
              ) : filtered.map((command, index) => (
                <button
                  className={index === activeIndex ? "palette-command active" : "palette-command"}
                  key={command.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => execute(command)}
                >
                  <span className="palette-command-group">{groupLabel(command.group)}</span>
                  <span className="palette-command-copy">
                    <strong>{command.label}</strong>
                    <small>{command.description}</small>
                  </span>
                  <span className="palette-enter" aria-hidden="true">↵</span>
                </button>
              ))}
            </div>

            <footer className="palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> {copy.command.navHint}</span>
              <span><kbd>↵</kbd> {copy.command.openHint}</span>
              <span>{copy.command.boundary}</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
