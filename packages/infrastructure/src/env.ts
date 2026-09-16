import { z } from "zod";

const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  AUTH_SECRET: z.string().min(32),
  AUTH_BASE_URL: z.string().url(),
  ARTIST_OS_DEFAULT_TIMEZONE: z.string().min(1).default("UTC"),
  AI_PROVIDER: z.enum(["disabled", "mock"]).default("disabled"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  STORAGE_ROOT: z.string().min(1).default(".data/storage")
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

let cached: RuntimeEnv | undefined;

export function parseRuntimeEnv(source: NodeJS.ProcessEnv): RuntimeEnv {
  const parsed = runtimeEnvSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid Artist OS runtime configuration: ${details}`);
  }
  return parsed.data;
}

export function getRuntimeEnv(): RuntimeEnv {
  cached ??= parseRuntimeEnv(process.env);
  return cached;
}
