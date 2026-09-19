"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import { getUiCopy, type Locale } from "@/lib/i18n";
import { useModalFocusTrap } from "./ui/use-modal-focus-trap";

type CommandGroup = "Navigate" | "Create" | "Operate";
type PaletteCommand = { id: string; label: string; description: string; group: CommandGroup; href: string; keywords: string[] };

const commandsFor = (locale: Locale): PaletteCommand[] => locale === "ru" ? [
  { id: "today", label: "Сегодня", description: "Текущий фокус, главное действие и блокеры", group: "Navigate", href: "/", keywords: ["сегодня", "фокус", "дальше", "today"] },
  { id: "create", label: "Создать", description: "Открыть Content Factory", group: "Navigate", href: "/factory", keywords: ["контент", "идеи", "create"] },
  { id: "music", label: "Музыка", description: "Песни и Song Brain", group: "Navigate", href: "/songs", keywords: ["песня", "трек", "music"] },
  { id: "brain", label: "Мозг", description: "Текущий рабочий контекст артиста", group: "Navigate", href: "/knowledge", keywords: ["мозг", "контекст", "brain"] },
  { id: "memory", label: "Память", description: "Решения, выводы и история обзоров", group: "Navigate", href: "/memory", keywords: ["память", "решения", "learning"] },
  { id: "decisions", label: "Решения", description: "Просмотреть важные выборы и причины", group: "Navigate", href: "/decisions", keywords: ["решение", "почему"] },
  { id: "learnings", label: "Выводы", description: "Проверенные и кандидатные Learnings", group: "Navigate", href: "/learnings", keywords: ["выводы", "данные", "learning"] },
  { id: "weekly-review", label: "Недельный обзор", description: "Превратить неделю в решения и действия", group: "Navigate", href: "/weekly-reviews", keywords: ["неделя", "обзор"] },
  { id: "identity", label: "Идентичность артиста", description: "Открыть текущий контекст Identity", group: "Navigate", href: "/identity", keywords: ["идентичность", "бренд"] },
  { id: "add-song", label: "Добавить песню", description: "Перейти в Музыку и добавить песню", group: "Create", href: "/songs", keywords: ["новая", "песня"] },
  { id: "create-angle", label: "Создать идею контента", description: "Начать новый Content Angle", group: "Create", href: "/factory", keywords: ["идея", "контент"] },
  { id: "what-next", label: "Что делать дальше?", description: "Вернуться к детерминированным приоритетам Today", group: "Operate", href: "/", keywords: ["дальше", "приоритет"] },
  { id: "show-blockers", label: "Показать блокеры", description: "Открыть Today с блокерами в приоритете", group: "Operate", href: "/", keywords: ["блокер", "blocked"] },
  { id: "run-weekly-review", label: "Запустить Недельный обзор", description: "Создать неизменяемый weekly snapshot", group: "Operate", href: "/weekly-reviews", keywords: ["обзор", "неделя"] }
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

export function CommandPalette({ locale }: { locale: Locale }) {
  const copy = getUiCopy(locale).command;
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
    return commands.filter((command) => normalize([command.label, command.description, command.group, ...command.keywords].join(" ")).includes(term));
  }, [commands, query]);

  const openPalette = useCallback((source: "button" | "shortcut") => {
    setOpen(true);
    emitProductTelemetry({ eventName: "COMMAND_PALETTE_OPENED", surface: "Global", entityType: "CommandPalette", metadata: { source } });
  }, []);

  const closePalette = useCallback(() => { setOpen(false); setQuery(""); setActiveIndex(0); }, []);
  useModalFocusTrap({ open, containerRef: dialogRef, initialFocusRef: inputRef, restoreFocusRef: triggerRef, onEscape: closePalette });

  const execute = (command: PaletteCommand) => {
    emitProductTelemetry({ eventName: "COMMAND_PALETTE_EXECUTED", surface: "Global", entityType: "CommandPalette", entityId: command.id, metadata: { group: command.group, queryUsed: Boolean(query.trim()) } });
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

  useEffect(() => { if (activeIndex >= filtered.length) setActiveIndex(0); }, [activeIndex, filtered.length]);

  const groupLabel = (group: CommandGroup) => group === "Navigate" ? copy.groups.navigate : group === "Create" ? copy.groups.create : copy.groups.operate;

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => filtered.length ? (index + 1) % filtered.length : 0); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => filtered.length ? (index - 1 + filtered.length) % filtered.length : 0); }
    else if (event.key === "Enter" && filtered[activeIndex]) { event.preventDefault(); execute(filtered[activeIndex]); }
  };

  return (
    <>
      <button ref={triggerRef} className="command-shell" type="button" onClick={() => openPalette("button")} aria-label={copy.open} aria-haspopup="dialog" aria-expanded={open}>
        <p>{copy.search}</p><span>⌘K</span>
      </button>
      {open && (
        <div className="palette-layer" role="presentation">
          <button className="palette-backdrop" type="button" aria-label={copy.close} onClick={closePalette} />
          <section ref={dialogRef} className="command-palette ui-dialog-surface" role="dialog" aria-modal="true" aria-label={copy.open} tabIndex={-1}>
            <header className="palette-search-row">
              <span className="palette-search-icon" aria-hidden="true">⌕</span>
              <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={onInputKeyDown} placeholder={copy.searchPlaceholder} aria-label={copy.search} aria-controls="command-palette-results" />
              <kbd>ESC</kbd>
            </header>
            <div className="palette-results" id="command-palette-results">
              {filtered.length === 0 ? (
                <div className="palette-empty"><strong>{copy.noMatch}</strong><span>{copy.noMatchHint}</span></div>
              ) : filtered.map((command, index) => (
                <button className={index === activeIndex ? "palette-command active" : "palette-command"} key={command.id} type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => execute(command)}>
                  <span className="palette-command-group">{groupLabel(command.group)}</span>
                  <span className="palette-command-copy"><strong>{command.label}</strong><small>{command.description}</small></span>
                  <span className="palette-enter" aria-hidden="true">↵</span>
                </button>
              ))}
            </div>
            <footer className="palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> {copy.navigate}</span>
              <span><kbd>↵</kbd> {copy.openAction}</span>
              <span>{copy.launcherOnly}</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
