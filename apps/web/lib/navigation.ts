export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  stage: "foundation" | "artist-foundation";
}

export const navigation: readonly NavigationItem[] = [
  { id: "overview", label: "Overview", href: "/", stage: "foundation" },
  { id: "identity", label: "Identity", href: "/identity", stage: "artist-foundation" },
  { id: "songs", label: "Songs", href: "/songs", stage: "artist-foundation" },
  { id: "auth", label: "Account", href: "/auth", stage: "foundation" }
] as const;
