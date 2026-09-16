export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  stage: "foundation";
}

export const navigation: readonly NavigationItem[] = [
  { id: "overview", label: "Overview", href: "/#overview", stage: "foundation" },
  { id: "foundation", label: "Foundation", href: "/#foundation", stage: "foundation" },
  { id: "auth", label: "Account", href: "/auth", stage: "foundation" }
] as const;
