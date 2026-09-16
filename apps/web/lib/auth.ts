import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { getRuntimeEnv } from "@artist-os/infrastructure";

const env = getRuntimeEnv();
const authPool = new Pool({
  connectionString: env.DATABASE_URL,
  options: "-c search_path=auth"
});

export const auth = betterAuth({
  appName: "Artist OS",
  baseURL: env.AUTH_BASE_URL,
  secret: env.AUTH_SECRET,
  database: authPool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  trustedOrigins: [env.AUTH_BASE_URL]
});
