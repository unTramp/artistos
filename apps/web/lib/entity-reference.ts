export interface EntityReferenceInput {
  type: string;
  id: string;
  version?: number;
}

export interface ResolvedEntityReference extends EntityReferenceInput {
  label: string;
  href: string | null;
  resolved: boolean;
}

export const entityReferenceKey = (type: string, id: string) => `${type}:${id}`;

export const shortEntityId = (id: string) => id.length > 18 ? `${id.slice(0, 8)}…${id.slice(-5)}` : id;

export const humanizeEntityType = (type: string) =>
  type.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replaceAll("_", " ").trim();
