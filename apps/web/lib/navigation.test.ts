import { describe, expect, it } from "vitest";
import { navigation } from "./navigation";

describe("primary navigation IA", () => {
  it("keeps Brain and Memory as separate top-level destinations", () => {
    const brain = navigation.find((item) => item.id === "brain");
    const memory = navigation.find((item) => item.id === "memory");

    expect(brain).toMatchObject({ href: "/knowledge", label: "Brain" });
    expect(memory).toMatchObject({ href: "/memory", label: "Memory" });
    expect(brain?.href).not.toBe(memory?.href);
  });
});
