"use client";

export default function ErrorState({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="state-shell" role="alert">
      <section className="state-card">
        <p className="eyebrow">RECOVERY</p>
        <h1 className="state-title">Workspace could not load</h1>
        <p className="state-copy">Artist OS kept the failure at the boundary. Retry the current screen; no internal error details are exposed here.</p>
        <button className="auth-button" type="button" onClick={reset}>Retry</button>
      </section>
    </main>
  );
}
