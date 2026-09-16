import { headers } from "next/headers";
import { AppShell } from "./components/app-shell";
import { auth } from "../lib/auth";

const foundation = [
  ["Runtime", "Web + worker modular monolith"],
  ["Data", "PostgreSQL + Drizzle foundation"],
  ["AI", "Optional adapter; core works without provider"],
  ["Control", "Human approval remains authoritative"]
] as const;

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <AppShell activeId="overview" sessionEmail={session?.user?.email}>
      <div id="overview">
        <header>
          <p className="eyebrow">SYSTEM STATUS</p>
          <h1>Artist OS</h1>
          <p>{session?.user ? "Authenticated foundation runtime is active for the current session." : "Foundation runtime is active. Authenticate to establish the user → artist workspace boundary."}</p>
        </header>

        {!session?.user && (
          <section className="empty-state" aria-label="Workspace context empty state">
            <p className="eyebrow">NO WORKSPACE CONTEXT</p>
            <h2>Artist scope has not been established</h2>
            <p>Sign in or create an account. Artist OS will then resolve the authenticated user boundary before any artist-owned command can run.</p>
            <a className="inline-link" href="/auth">Establish workspace context →</a>
          </section>
        )}

        <div className="grid" id="foundation">{foundation.map(([title, value]) => <article key={title}><span>{title}</span><strong>{value}</strong></article>)}</div>
        <section className="focus"><p className="eyebrow">CURRENT FOCUS</p><h2>Make the architecture executable</h2><p>Authenticated request → application command → domain → PostgreSQL/outbox → worker → trace.</p><a className="inline-link" href={session?.user ? "/identity" : "/auth"}>{session?.user ? "Open Artist Foundation →" : "Open Stage 0 authentication →"}</a></section>
      </div>
    </AppShell>
  );
}
