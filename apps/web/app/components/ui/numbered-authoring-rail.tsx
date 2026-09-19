"use client";

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export type AuthoringRailItem = {
  id: string;
  label: string;
  description?: string;
};

export function NumberedAuthoringRail({
  label,
  activeId,
  items,
  onChange,
  className
}: {
  label: string;
  activeId: string;
  items: AuthoringRailItem[];
  onChange: (id: string) => void;
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number) => {
    const item = items[index];
    if (!item) return;
    onChange(item.id);
    refs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move((index + 1) % items.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move((index - 1 + items.length) % items.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(items.length - 1);
    }
  };

  return (
    <div
      className={className ? `ui-authoring-rail ${className}` : "ui-authoring-rail"}
      aria-label={label}
      role="navigation"
      style={{ "--authoring-columns": Math.max(1, items.length) } as CSSProperties}
    >
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(node) => { refs.current[index] = node; }}
            type="button"
            aria-current={active ? "step" : undefined}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="ui-authoring-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="ui-authoring-copy">
              <strong>{item.label}</strong>
              {item.description ? <small>{item.description}</small> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AuthoringSection({
  id,
  labelledBy,
  children,
  className
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={className ? `ui-authoring-section ${className}` : "ui-authoring-section"}
    >
      {children}
    </section>
  );
}
