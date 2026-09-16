import pino, { type DestinationStream } from "pino";

export * from "./env";
export * from "./local-storage";

export const createLogger = ({ service, destination }: { service: string; destination?: DestinationStream }) => pino({
  base: { service, environment: process.env.NODE_ENV ?? "development" },
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "password", "token", "secret", "authorization",
      "*.password", "*.token", "*.secret", "*.authorization",
      "req.headers.authorization"
    ],
    censor: "[REDACTED]"
  }
}, destination);

export interface StorageObjectHead {
  key: string;
  size: number;
  checksum?: string;
}

export interface StorageAccessGrant {
  url: string;
  expiresAt: Date;
  visibility: "PRIVATE";
}

export interface StorageProvider {
  put(key: string, data: Uint8Array): Promise<void>;
  head(key: string): Promise<StorageObjectHead | null>;
  delete(key: string): Promise<void>;
  createAccessUrl(key: string, ttlSeconds: number): Promise<StorageAccessGrant>;
}
