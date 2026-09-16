export type Brand<T, B extends string> = T & { readonly __brand: B };
export type ArtistId = Brand<string, "ArtistId">;
export type TraceId = Brand<string, "TraceId">;
export const newId = <B extends string>() => crypto.randomUUID() as Brand<string, B>;
