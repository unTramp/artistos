import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) redirect("/auth");
  if (actorContext.artistId) redirect("/");

  const defaultName = actorContext.user.email.split("@")[0] ?? "";

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email}>
      <section className="onboarding-shell">
        <div className="onboarding-intro">
          <p className="eyebrow">ARTIST WORKSPACE</p>
          <h1>Start with the minimum useful context.</h1>
          <p>Artist OS should learn progressively from your work. We only need enough information to create the canonical workspace now.</p>
          <div className="onboarding-principles">
            <div><span>01</span><strong>No giant questionnaire</strong><p>Identity, songs and preferences can grow over time.</p></div>
            <div><span>02</span><strong>One canonical artist</strong><p>Future memory and decisions stay attached to the same owner.</p></div>
            <div><span>03</span><strong>Human-controlled</strong><p>AI can suggest later; important state starts with your confirmation.</p></div>
          </div>
        </div>
        <section className="onboarding-card">
          <span className="signal-label">STEP 1 OF 1</span>
          <h2>Create workspace</h2>
          <p>We can establish Identity and add your first Song after this.</p>
          <OnboardingForm defaultName={defaultName} />
        </section>
      </section>
    </AppShell>
  );
}
