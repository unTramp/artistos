import { betterAuth } from "better-auth";
import { getRuntimeEnv } from "@artist-os/infrastructure";
import { getDatabaseRuntime } from "./runtime";

const env = getRuntimeEnv();
const { pool } = getDatabaseRuntime();

export const auth = betterAuth({
  appName: "Artist OS",
  baseURL: env.AUTH_BASE_URL,
  secret: env.AUTH_SECRET,
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  trustedOrigins: [env.AUTH_BASE_URL]
});
