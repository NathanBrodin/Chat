import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string(),
    BETTER_AUTH_SECRET: z.string(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_CONVEX_URL: z.string(),
    VITE_SITE_URL: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
