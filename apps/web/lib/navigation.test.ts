import { describe, expect, it } from "vitest";
import { navigation } from "./navigation";

describe("primary navigation information architecture", () => {
  it("keeps Brain and Memory as separate top-level destinations", () => {
    const brain = navigation.find((item) => item.id === "brain");
    const memory = navigation.find((item) => item.id === "memory");

    expect(brain).toMatchObject({ href: "/knowledge", label: "Brain" });
    expect(memory).toMatchObject({ href: "/memory", label: "Memory" });
    expect(brain?.href).not.toBe(memory?.href);
  });

  it("does not alias Memory to a single specialist owner", () => {
    expect(navigation.find((item) => item.id === "memory")?.href).not.toBe("/decisions");
    expect(navigation.find((item) => item.id === "memory")?.href).not.toBe("/learnings");
    expect(navigation.find((item) => item.id === "memory")?.href).not.toBe("/weekly-reviews");
  });
});
