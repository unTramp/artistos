import type { ReactNode } from "react";
import { Brain, History, Home, Music2, Orbit, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { navigation } from "../../lib/navigation";
import { getMessages } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";
import { CommandPalette } from "./command-palette";
import { LanguageSwitcher } from "./language-switcher";

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

export async function AppShell({
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
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const primaryActiveId = primaryNavByRoute[activeId] ?? activeId;

  return (
    <main className="app-shell">
      <aside className="app-sidebar" aria-label={messages.shell.workspaceAria}>
        <div className="app-brand-row">
          <div className="app-brand-mark" aria-hidden="true"><Orbit size={17} /></div>
          <div className="app-brand-copy">
            <strong>Artist OS</strong>
            <span>{messages.shell.brandTagline}</span>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar" aria-hidden="true">{initialsFor(workspaceLabel)}</div>
          <div>
            <strong>{workspaceLabel}</strong>
            <span>{sessionEmail ? messages.shell.activeWorkspace : messages.shell.authRequired}</span>
          </div>
        </div>

        <nav className="app-primary-nav" aria-label={messages.shell.primaryNav}>
          {navigation.map((item) => {
            const Icon = navIcons[item.id];
            const active = item.id === primaryActiveId;
            const label = messages.shell.navigation[item.id as keyof typeof messages.shell.navigation] ?? item.label;
            return (
              <a
                className={active ? "active" : undefined}
                href={item.href}
                key={item.id}
                aria-current={active ? "page" : undefined}
              >
                {Icon ? <Icon aria-hidden={true} focusable={false} /> : null}
                <span>{label}</span>
              </a>
            );
          })}
        </nav>

        <div className="loop-card" aria-label={messages.shell.learningLoopAria}>
          <span>{messages.shell.learningLoopLabel}</span>
          <p>{messages.shell.learningLoopText}</p>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <CommandPalette />
          <div className="app-topbar-spacer" />
          <LanguageSwitcher />
          <div className="context-pill"><i aria-hidden="true" />{messages.shell.contextReady}</div>
          <a className="account-pill" href="/auth">{sessionEmail ?? messages.shell.signIn}</a>
        </header>
        <section className="app-content">{children}</section>
      </section>
    </main>
  );
}
