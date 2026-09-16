import pino from "pino";

export const createLogger = ({ service }: { service: string }) => pino({
  base: { service, environment: process.env.NODE_ENV ?? "development" },
  level: process.env.LOG_LEVEL ?? "info",
  redact: { paths: ["*.password", "*.token", "*.secret", "*.authorization", "req.headers.authorization"], censor: "[REDACTED]" }
});

export interface StorageObjectHead { key:string; size:number; checksum?:string; }
export interface StorageProvider { put(key:string, data:Uint8Array):Promise<void>; head(key:string):Promise<StorageObjectHead | null>; delete(key:string):Promise<void>; createAccessUrl(key:string, ttlSeconds:number):Promise<string>; }
