export type ProductStage = "foundation" | "artist-foundation" | "content-factory";

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  stage: ProductStage;
}

export const navigation = [
  { id: "overview", href: "/", label: "Overview", stage: "foundation" },
  { id: "identity", href: "/identity", label: "Identity", stage: "artist-foundation" },
  { id: "songs", href: "/songs", label: "Songs", stage: "artist-foundation" },
  { id: "knowledge", href: "/knowledge", label: "Knowledge", stage: "artist-foundation" },
  { id: "factory", href: "/factory", label: "Factory", stage: "content-factory" },
  { id: "account", href: "/auth", label: "Account", stage: "foundation" }
] satisfies NavigationItem[];
