"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import { useModalFocusTrap } from "./ui/use-modal-focus-trap";
import { useI18n } from "./locale-provider";

type CommandGroup = "navigate" | "create" | "operate";

type PaletteCommand = {
  id: string;
  label: string;
  description: string;
  group: CommandGroup;
  href: string;
  keywords: string[];
};

const commandMeta = [
  { id: "today", key: "today", group: "navigate", href: "/", keywords: ["home", "attention", "next", "сегодня", "внимание"] },
  { id: "create", key: "create", group: "navigate", href: "/factory", keywords: ["content", "factory", "angles", "контент", "создать"] },
  { id: "music", key: "music", group: "navigate", href: "/songs", keywords: ["song", "track", "brain", "музыка", "песня"] },
  { id: "brain", key: "brain", group: "navigate", href: "/knowledge", keywords: ["knowledge", "context", "rules", "inbox", "контекст", "знания"] },
  { id: "memory", key: "memory", group: "navigate", href: "/memory", keywords: ["memory", "decision", "learning", "review", "history", "память", "решение"] },
  { id: "decisions", key: "decisions", group: "navigate", href: "/decisions", keywords: ["decision", "why", "history", "решения"] },
  { id: "learnings", key: "learnings", group: "navigate", href: "/learnings", keywords: ["learning", "evidence", "validated", "выводы"] },
  { id: "weekly-review", key: "weeklyReview", group: "navigate", href: "/weekly-reviews", keywords: ["review", "week", "ritual", "обзор", "неделя"] },
  { id: "identity", key: "identity", group: "navigate", href: "/identity", keywords: ["identity", "brand", "artist", "идентичность"] },
  { id: "add-song", key: "addSong", group: "create", href: "/songs", keywords: ["new", "track", "song", "песня"] },
  { id: "create-angle", key: "createAngle", group: "create", href: "/factory", keywords: ["idea", "content", "angle", "draft", "идея", "контент"] },
  { id: "what-next", key: "whatNext", group: "operate", href: "/", keywords: ["next", "priority", "focus", "today", "дальше", "приоритет"] },
  { id: "show-blockers", key: "showBlockers", group: "operate", href: "/", keywords: ["blocked", "blocker", "attention", "блокер"] },
  { id: "run-weekly-review", key: "runWeeklyReview", group: "operate", href: "/weekly-reviews", keywords: ["generate", "review", "week", "обзор"] }
] as const;

const normalize = (value: string) => value.trim().toLowerCase();

export function CommandPalette() {
  const { messages } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<PaletteCommand[]>(() => commandMeta.map((meta) => {
    const copy = messages.commandPalette.commands[meta.key];
    return {
      id: meta.id,
      label: copy[0],
      description: copy[1],
      group: meta.group,
      href: meta.href,
      keywords: [...meta.keywords]
    };
  }), [messages]);

  const filtered = useMemo(() => {
    const term = normalize(query);
    if (!term) return commands;
    return commands.filter((command) => normalize([
      command.label,
      command.description,
      messages.commandPalette.groups[command.group],
      ...command.keywords
    ].join(" ")).includes(term));
  }, [commands, messages, query]);

  const openPalette = useCallback((source: "button" | "shortcut") => {
    setOpen(true);
    emitProductTelemetry({
      eventName: "COMMAND_PALETTE_OPENED",
      surface: "Global",
      entityType: "CommandPalette",
      metadata: { source }
    });
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useModalFocusTrap({
    open,
    containerRef: dialogRef,
    initialFocusRef: inputRef,
    restoreFocusRef: triggerRef,
    onEscape: closePalette
  });

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

  return (
    <>
      <button
        ref={triggerRef}
        className="command-shell"
        type="button"
        onClick={() => openPalette("button")}
        aria-label={messages.commandPalette.openAria}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <p>{messages.commandPalette.trigger}</p>
        <span>⌘K</span>
      </button>

      {open && (
        <div className="palette-layer" role="presentation">
          <button className="palette-backdrop" type="button" aria-label={messages.commandPalette.closeAria} onClick={closePalette} />
          <section
            ref={dialogRef}
            className="command-palette ui-dialog-surface"
            role="dialog"
            aria-modal="true"
            aria-label={messages.commandPalette.dialogAria}
            tabIndex={-1}
          >
            <header className="palette-search-row">
              <span className="palette-search-icon" aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                onKeyDown={onInputKeyDown}
                placeholder={messages.commandPalette.placeholder}
                aria-label={messages.commandPalette.searchAria}
                aria-controls="command-palette-results"
              />
              <kbd>ESC</kbd>
            </header>

            <div className="palette-results" id="command-palette-results">
              {filtered.length === 0 ? (
                <div className="palette-empty">
                  <strong>{messages.commandPalette.noMatch}</strong>
                  <span>{messages.commandPalette.noMatchHint}</span>
                </div>
              ) : filtered.map((command, index) => (
                <button
                  className={index === activeIndex ? "palette-command active" : "palette-command"}
                  key={command.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => execute(command)}
                >
                  <span className="palette-command-group">{messages.commandPalette.groups[command.group]}</span>
                  <span className="palette-command-copy">
                    <strong>{command.label}</strong>
                    <small>{command.description}</small>
                  </span>
                  <span className="palette-enter" aria-hidden="true">↵</span>
                </button>
              ))}
            </div>

            <footer className="palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> {messages.commandPalette.navigate}</span>
              <span><kbd>↵</kbd> {messages.commandPalette.open}</span>
              <span>{messages.commandPalette.launcherOnly}</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
