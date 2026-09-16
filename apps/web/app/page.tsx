const foundation = [
  ["Runtime", "Web + worker modular monolith"],
  ["Data", "PostgreSQL + Drizzle foundation"],
  ["AI", "Optional adapter; core works without provider"],
  ["Control", "Human approval remains authoritative"]
] as const;

export default function HomePage() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">ARTIST <span>OS</span></div>
        <nav aria-label="Primary"><a className="active" href="#overview">Overview</a><a href="#foundation">Foundation</a><a href="/auth">Authentication</a></nav>
        <div className="stage">Stage 0 · Foundation</div>
      </aside>
      <section className="content" id="overview">
        <header><p className="eyebrow">SYSTEM STATUS</p><h1>Artist OS</h1><p>Foundation runtime is being assembled from the frozen v1.4 architecture.</p></header>
        <div className="grid" id="foundation">{foundation.map(([title, value]) => <article key={title}><span>{title}</span><strong>{value}</strong></article>)}</div>
        <section className="focus"><p className="eyebrow">CURRENT FOCUS</p><h2>Make the architecture executable</h2><p>Authenticated request → application command → domain → PostgreSQL/outbox → worker → trace.</p><a className="inline-link" href="/auth">Open Stage 0 authentication →</a></section>
      </section>
    </main>
  );
}
