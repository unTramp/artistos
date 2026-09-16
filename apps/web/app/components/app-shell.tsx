import type { ReactNode } from "react";
import { navigation } from "../../lib/navigation";

export function AppShell({
  activeId,
  sessionEmail,
  stage = "Stage 0 · Foundation",
  children
}: {
  activeId: string;
  sessionEmail?: string | null | undefined;
  stage?: string | undefined;
  children: ReactNode;
}) {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">ARTIST <span>OS</span></div>
        <nav aria-label="Primary">
          {navigation.map((item) => (
            <a className={item.id === activeId ? "active" : undefined} href={item.href} key={item.id}>{item.label}</a>
          ))}
        </nav>
        <div className="session-state">
          <span>{sessionEmail ? "AUTHENTICATED" : "AUTH REQUIRED"}</span>
          <strong>{sessionEmail ?? "Sign in to establish artist scope"}</strong>
        </div>
        <div className="stage">{stage}</div>
      </aside>
      <section className="content">{children}</section>
    </main>
  );
}
