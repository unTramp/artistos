export default function Loading() {
  return (
    <main className="state-shell" aria-busy="true" aria-live="polite">
      <section className="state-card">
        <p className="eyebrow">ARTIST OS</p>
        <h1 className="state-title">Loading workspace…</h1>
        <p className="state-copy">Restoring the foundation runtime and workspace context.</p>
      </section>
    </main>
  );
}
