"use client";

import { FormEvent, useState } from "react";
import { authClient } from "../../lib/auth-client";

type Mode = "sign-in" | "sign-up";

export default function AuthPage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const result = mode === "sign-up"
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setMessage(result.error.message ?? "Authentication failed.");
        return;
      }

      setPassword("");
      await refetch();
      window.location.assign(mode === "sign-up" ? "/onboarding" : "/");
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    setSubmitting(true);
    setMessage(null);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setMessage(result.error.message ?? "Sign out failed.");
        return;
      }
      setMessage("Signed out.");
      await refetch();
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return <main className="auth-shell"><section className="auth-card" aria-busy="true">Restoring session…</section></main>;
  }

  if (session?.user) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">ARTIST OS SESSION</p>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-muted">Session restored for <strong>{session.user.email}</strong>.</p>
          <div className="auth-actions">
            <a className="auth-button auth-button-secondary" href="/">Open Artist OS</a>
            <button className="auth-button" type="button" onClick={() => void signOut()} disabled={submitting}>Sign out</button>
          </div>
          {message ? <p className="auth-message" role="status">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <a className="auth-back" href="/">← Artist OS</a>
        <p className="eyebrow">PRIVATE ARTIST WORKSPACE</p>
        <h1 className="auth-title">{mode === "sign-in" ? "Sign in" : "Create account"}</h1>
        <p className="auth-muted">Your identity, music, memory and decisions stay inside one authenticated artist scope.</p>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button className={mode === "sign-in" ? "active" : ""} type="button" onClick={() => { setMode("sign-in"); setMessage(null); }}>Sign in</button>
          <button className={mode === "sign-up" ? "active" : ""} type="button" onClick={() => { setMode("sign-up"); setMessage(null); }}>Sign up</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "sign-up" ? (
            <label>
              <span>Name</span>
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={1} />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </label>
          <button className="auth-button" type="submit" disabled={submitting}>{submitting ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
        </form>

        {message ? <p className="auth-message" role="status">{message}</p> : null}
      </section>
    </main>
  );
}
