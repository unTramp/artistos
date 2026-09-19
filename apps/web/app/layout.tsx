import type { Metadata } from "next";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
