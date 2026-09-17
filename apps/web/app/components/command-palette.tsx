"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";

type CommandGroup = "Navigate" | "Create" | "Operate";

type PaletteCommand = {
  id: string;
  label: string;
  description: string;
  group: CommandGroup;
  href: string;
  keywords: string[];
};

const commands: PaletteCommand[] = [
  { id: "today", label: "Today", description: "Open current focus, next action and blockers", group: "Navigate", href: "/", keywords: ["home", "attention", "next"] },
  { id: "create", label: "Create", description: "Open Content Factory", group: "Navigate", href: "/factory", keywords: ["content", "factory", "angles"] },
  { id: "music", label: "Music", description: "Open songs and Song Brain", group: "Navigate", href: "/songs", keywords: ["song", "track", "brain"] },
  { id: "brain", label: "Brain", description: "Open artist knowledge and review inbox", group: "Navigate", href: "/knowledge", keywords: ["knowledge", "memory", "inbox"] },
  { id: "memory", label: "Decision Memory", description: "Review material choices and rationale", group: "Navigate", href: "/decisions", keywords: ["decision", "why", "history"] },
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

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const term = normalize(query);
    if (!term) return commands;
    return commands.filter((command) => normalize([
      command.label,
      command.description,
      command.group,
      ...command.keywords
    ].join(" ")).includes(term));
  }, [query]);

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
        return;
      }
      if (event.key === "Escape" && open) closePalette();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePalette, open, openPalette]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

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
      <button className="command-shell" type="button" onClick={() => openPalette("button")} aria-label="Open command palette">
        <p>Search or run command</p>
        <span>⌘K</span>
      </button>

      {open && (
        <div className="palette-layer" role="presentation">
          <button className="palette-backdrop" type="button" aria-label="Close command palette" onClick={closePalette} />
          <section className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
            <header className="palette-search-row">
              <span className="palette-search-icon">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages, actions or questions…"
                aria-label="Search commands"
                aria-controls="command-palette-results"
              />
              <kbd>ESC</kbd>
            </header>

            <div className="palette-results" id="command-palette-results">
              {filtered.length === 0 ? (
                <div className="palette-empty">
                  <strong>No matching command</strong>
                  <span>Try Today, blockers, Weekly Review, song, Brain or content.</span>
                </div>
              ) : filtered.map((command, index) => (
                <button
                  className={index === activeIndex ? "palette-command active" : "palette-command"}
                  key={command.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => execute(command)}
                >
                  <span className="palette-command-group">{command.group}</span>
                  <span className="palette-command-copy">
                    <strong>{command.label}</strong>
                    <small>{command.description}</small>
                  </span>
                  <span className="palette-enter">↵</span>
                </button>
              ))}
            </div>

            <footer className="palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Open</span>
              <span>Launcher only · no hidden mutations</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
