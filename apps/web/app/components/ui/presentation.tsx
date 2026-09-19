import type { ReactNode } from "react";

const join = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={join("ui-page-header", className)}>
      {eyebrow ? <p className="ui-page-eyebrow">{eyebrow}</p> : null}
      <div className="ui-page-header-row">
        <h1 className="ui-page-title">{title}</h1>
        {actions ? <div>{actions}</div> : null}
      </div>
      {description ? <p className="ui-page-description">{description}</p> : null}
    </header>
  );
}

export function LocalSegmentedNav({
  label,
  activeId,
  items,
  className
}: {
  label: string;
  activeId: string;
  items: Array<{ id: string; label: string; href: string }>;
  className?: string;
}) {
  return (
    <nav className={join("ui-segmented-nav", className)} aria-label={label}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={item.id === activeId ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function Surface({
  children,
  nested = false,
  className
}: {
  children: ReactNode;
  nested?: boolean;
  className?: string;
}) {
  return (
    <section className={join(nested ? "ui-surface-nested" : "ui-surface", "ui-section-surface", className)}>
      {children}
    </section>
  );
}

export type StatusTone = "neutral" | "info" | "intelligence" | "success" | "attention" | "danger";

export function StatusChip({
  children,
  tone = "neutral",
  className
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span className={join("ui-status-chip", className)} data-tone={tone}>
      {children}
    </span>
  );
}

export function ActionLink({
  href,
  children,
  variant = "secondary",
  className
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
}) {
  return (
    <a className={join("ui-button", `ui-button-${variant}`, className)} href={href}>
      {children}
    </a>
  );
}

export function ActionButton({
  children,
  variant = "secondary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
}) {
  return (
    <button className={join("ui-button", `ui-button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export function AccessibleStatus({
  children,
  assertive = false
}: {
  children?: ReactNode;
  assertive?: boolean;
}) {
  return (
    <div
      className="ui-status-region"
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {children}
    </div>
  );
}
