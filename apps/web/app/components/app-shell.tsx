import type { ReactNode } from "react";
import { Brain, History, Home, Music2, Orbit, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { navigation } from "../../lib/navigation";
import { CommandPalette } from "./command-palette";

const primaryNavByRoute: Record<string, string> = {
  overview: "today",
  identity: "brain",
  knowledge: "brain",
  songs: "music",
  factory: "create"
};

const navIcons: Record<string, LucideIcon> = {
  today: Home,
  create: Sparkles,
  music: Music2,
  brain: Brain,
  memory: History,
  account: UserRound
};

const initialsFor = (label: string) => {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AO";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "AO";
};

export function AppShell({
  activeId,
  sessionEmail,
  workspaceLabel = "Artist Workspace",
  children
}: {
  activeId: string;
  sessionEmail?: string | null | undefined;
  workspaceLabel?: string | undefined;
  stage?: string | undefined;
  children: ReactNode;
}) {
  const primaryActiveId = primaryNavByRoute[activeId] ?? activeId;

  return (
    <main className="app-shell">
      <aside className="app-sidebar" aria-label="Artist OS workspace">
        <div className="app-brand-row">
          <div className="app-brand-mark" aria-hidden="true"><Orbit size={17} /></div>
          <div className="app-brand-copy">
            <strong>Artist OS</strong>
            <span>Human-Controlled · Evidence-Driven</span>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar" aria-hidden="true">{initialsFor(workspaceLabel)}</div>
          <div>
            <strong>{workspaceLabel}</strong>
            <span>{sessionEmail ? "Active workspace" : "Authentication required"}</span>
          </div>
        </div>

        <nav className="app-primary-nav" aria-label="Primary">
          {navigation.map((item) => {
            const Icon = navIcons[item.id];
            const active = item.id === primaryActiveId;
            return (
              <a
                className={active ? "active" : undefined}
                href={item.href}
                key={item.id}
                aria-current={active ? "page" : undefined}
              >
                {Icon ? <Icon aria-hidden={true} focusable={false} /> : null}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="loop-card" aria-label="Artist OS learning loop">
          <span>Learning loop active</span>
          <p>Context → Action → Evidence → Learning → Better decision</p>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <CommandPalette />
          <div className="app-topbar-spacer" />
          <div className="context-pill"><i aria-hidden="true" />Context Ready</div>
          <a className="account-pill" href="/auth">{sessionEmail ?? "Sign in"}</a>
        </header>
        <section className="app-content">{children}</section>
      </section>
    </main>
  );
}
