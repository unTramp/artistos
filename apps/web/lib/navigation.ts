export type ProductStage = "daily-os" | "artist-foundation" | "content-factory";

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  stage: ProductStage;
}

export const navigation = [
  { id: "today", href: "/", label: "Today", stage: "daily-os" },
  { id: "create", href: "/factory", label: "Create", stage: "content-factory" },
  { id: "music", href: "/songs", label: "Music", stage: "artist-foundation" },
  { id: "brain", href: "/knowledge", label: "Brain", stage: "artist-foundation" },
  { id: "memory", href: "/memory", label: "Memory", stage: "daily-os" },
  { id: "account", href: "/auth", label: "Account", stage: "daily-os" }
] satisfies NavigationItem[];
