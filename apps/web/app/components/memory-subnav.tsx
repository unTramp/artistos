const items = [
  { id: "overview", href: "/memory", label: "Overview" },
  { id: "decisions", href: "/decisions", label: "Decisions" },
  { id: "learnings", href: "/learnings", label: "Learnings" },
  { id: "reviews", href: "/weekly-reviews", label: "Weekly Reviews" }
] as const;

export function MemorySubnav({ active }: { active: typeof items[number]["id"] }) {
  return (
    <nav className="memory-subnav" aria-label="Memory workspace">
      {items.map((item) => (
        <a className={item.id === active ? "active" : undefined} href={item.href} key={item.id}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
