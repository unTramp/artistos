import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { navigation } from "../lib/navigation";

const foundation = [
  ["Runtime", "Web + worker modular monolith"],
  ["Data", "PostgreSQL + Drizzle foundation"],
  ["AI", "Optional adapter; core works without provider"],
  ["Control", "Human approval remains authoritative"]
] as const;

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">ARTIST <span>OS</span></div>
        <nav aria-label="Primary">
          {navigation.map((item) => (
            <a className={item.id === "overview" ? "active" : undefined} href={item.href} key={item.id}>{item.label}</a>
          ))}
        </nav>
        <div className="session-state">
          <span>{session?.user ? "AUTHENTICATED" : "AUTH REQUIRED"}</span>
          <strong>{session?.user?.email ?? "Sign in to establish artist scope"}</strong>
        </div>
        <div className="stage">Stage 0 · Foundation</div>
      </aside>
      <section className="content" id="overview">
        <header>
          <p className="eyebrow">SYSTEM STATUS</p>
          <h1>Artist OS</h1>
          <p>{session?.user ? "Authenticated foundation runtime is active for the current session." : "Foundation runtime is active. Authenticate to establish the user → artist workspace boundary."}</p>
        </header>
        <div className="grid" id="foundation">{foundation.map(([title, value]) => <article key={title}><span>{title}</span><strong>{value}</strong></article>)}</div>
        <section className="focus"><p className="eyebrow">CURRENT FOCUS</p><h2>Make the architecture executable</h2><p>Authenticated request → application command → domain → PostgreSQL/outbox → worker → trace.</p><a className="inline-link" href="/auth">{session?.user ? "Manage Stage 0 session →" : "Open Stage 0 authentication →"}</a></section>
      </section>
    </main>
  );
}
