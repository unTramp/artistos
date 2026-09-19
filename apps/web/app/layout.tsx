import type { Metadata } from "next";
import { getServerLocale } from "@/lib/i18n-server";
import "./globals.css";
import "./design-system.css";
import "./commands.css";
import "./execution.css";
import "./factory-ai.css";
import "./daily-os.css";
import "./attention-explainability.css";
import "./recommendation-maturity.css";
import "./command-palette.css";
import "./planning-objective.css";
import "./current-focus.css";
import "./decision-memory.css";
import "./operational-action-controls.css";

export const metadata: Metadata = {
  title: "Artist OS",
  description: "Human-controlled operating system for independent artists"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return <html lang={locale}><body>{children}</body></html>;
}
