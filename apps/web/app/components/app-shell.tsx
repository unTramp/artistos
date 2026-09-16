import type { ReactNode } from "react";
import { navigation } from "../../lib/navigation";

export function AppShell({
  activeId,
  sessionEmail,
  workspaceLabel = "Artist Workspace",
  children
}: {
  activeId: string;
  sessionEmail?: string | null | undefined;
  workspaceLabel?: string | undefined;
  children: ReactNode;
}) {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">◎</div>
          <div>
            <div className="brand">Artist OS</div>
            <div className="brand-subtitle">Human-Controlled · Evidence-Driven</div>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar">AO</div>
          <div>
            <strong>{workspaceLabel}</strong>
            <span>{sessionEmail ? "Active workspace" : "Authentication required"}</span>
          </div>
        </div>

        <nav aria-label="Primary">
          {navigation.map((item) => (
            <a className={item.id === activeId ? "active" : undefined} href={item.href} key={item.id}>{item.label}</a>
          ))}
        </nav>

        <div className="loop-card">
          <span>Closed-loop active</span>
          <p>Context → Action → Evidence → Learning → Better decision</p>
        </div>
      </aside>

      <section className="app-main">
        <header className="topbar">
          <div className="command-shell">
            <span>⌘K</span>
            <p>Search or run command</p>
          </div>
          <div className="topbar-spacer" />
          <div className="context-pill"><i />Context Ready</div>
          <a className="account-pill" href="/auth">{sessionEmail ?? "Sign in"}</a>
        </header>
        <section className="content">{children}</section>
      </section>
    </main>
  );
}
