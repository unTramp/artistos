import type { ReactNode } from "react";
import { Brain, History, Home, Music2, Orbit, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { navigation } from "../../lib/navigation";
import { getServerLocale } from "@/lib/i18n-server";
import { getUiCopy } from "@/lib/i18n";
import { CommandPalette } from "./command-palette";
import { LocaleSwitcher } from "./locale-switcher";

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
  children
}: {
  activeId: string;
  sessionEmail?: string | null | undefined;
  workspaceLabel?: string | undefined;
  stage?: string | undefined;
  children: ReactNode;
}) {
  const locale = await getServerLocale();
  const copy = getUiCopy(locale);
  const primaryActiveId = primaryNavByRoute[activeId] ?? activeId;
  const effectiveWorkspaceLabel = workspaceLabel ?? copy.shell.workspace;

  return (
    <main className="app-shell">
      <aside className="app-sidebar" aria-label={copy.shell.workspaceLabel}>
        <div className="app-brand-row">
          <div className="app-brand-mark" aria-hidden="true"><Orbit size={17} /></div>
          <div className="app-brand-copy">
            <strong>Artist OS</strong>
            <span>Human-Controlled · Evidence-Driven</span>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar" aria-hidden="true">{initialsFor(effectiveWorkspaceLabel)}</div>
          <div>
            <strong>{effectiveWorkspaceLabel}</strong>
            <span>{sessionEmail ? copy.shell.activeWorkspace : copy.shell.authRequired}</span>
          </div>
        </div>

        <nav className="app-primary-nav" aria-label={copy.shell.primaryNav}>
          {navigation.map((item) => {
            const Icon = navIcons[item.id];
            const active = item.id === primaryActiveId;
            const label = copy.shell.nav[item.id as keyof typeof copy.shell.nav] ?? item.label;
            return (
              <a className={active ? "active" : undefined} href={item.href} key={item.id} aria-current={active ? "page" : undefined}>
                {Icon ? <Icon aria-hidden={true} focusable={false} /> : null}
                <span>{label}</span>
              </a>
            );
          })}
        </nav>

        <div className="loop-card" aria-label="Artist OS learning loop">
          <span>{copy.shell.learningLoop}</span>
          <p>{copy.shell.learningLoopFlow}</p>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <CommandPalette locale={locale} />
          <div className="app-topbar-spacer" />
          <LocaleSwitcher locale={locale} />
          <div className="context-pill"><i aria-hidden="true" />{copy.shell.contextReady}</div>
          <a className="account-pill" href="/auth">{sessionEmail ?? copy.shell.signIn}</a>
        </header>
        <section className="app-content">{children}</section>
      </section>
    </main>
  );
}
