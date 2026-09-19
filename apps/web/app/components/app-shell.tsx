import type { ReactNode } from "react";
import { Brain, History, Home, Music2, Orbit, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { navigation } from "../../lib/navigation";
import { getUiCopy, type UiLocale } from "@/lib/i18n";
import { resolveUiLocale } from "@/lib/ui-locale-server";
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
  workspaceLabel,
  children,
  locale
}: {
  activeId: string;
  sessionEmail?: string | null | undefined;
  workspaceLabel?: string | undefined;
  stage?: string | undefined;
  children: ReactNode;
  locale?: UiLocale;
}) {
  const resolvedLocale = locale ?? await resolveUiLocale();
  const copy = getUiCopy(resolvedLocale);
  const resolvedWorkspaceLabel = workspaceLabel ?? copy.shell.workspaceLabel;
  const primaryActiveId = primaryNavByRoute[activeId] ?? activeId;

  return (
    <main className="app-shell">
      <aside className="app-sidebar" aria-label={copy.shell.workspace}>
        <div className="app-brand-row">
          <div className="app-brand-mark" aria-hidden="true"><Orbit size={17} /></div>
          <div className="app-brand-copy">
            <strong>Artist OS</strong>
            <span>{copy.shell.tagline}</span>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar" aria-hidden="true">{initialsFor(resolvedWorkspaceLabel)}</div>
          <div>
            <strong>{resolvedWorkspaceLabel}</strong>
            <span>{sessionEmail ? copy.shell.activeWorkspace : copy.shell.authRequired}</span>
          </div>
        </div>

        <nav className="app-primary-nav" aria-label={copy.shell.primaryNav}>
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
                <span>{copy.nav[item.id as keyof typeof copy.nav] ?? item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-language-switcher"><LanguageSwitcher locale={resolvedLocale} /></div>
        <div className="loop-card" aria-label={copy.shell.learningLoop}>
          <span>{copy.shell.learningLoop}</span>
          <p>{copy.shell.learningLoopPath}</p>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <CommandPalette locale={resolvedLocale} />
          <div className="app-topbar-spacer" />
          <LanguageSwitcher locale={resolvedLocale} />
          <div className="context-pill"><i aria-hidden="true" />{copy.shell.contextReady}</div>
          <a className="account-pill" href="/auth">{sessionEmail ?? copy.shell.signIn}</a>
        </header>
        <section className="app-content">{children}</section>
      </section>
    </main>
  );
}
