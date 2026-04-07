const env = {
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL!,
  VITE_CONVEX_SITE_URL: import.meta.env.VITE_CONVEX_SITE_URL!,
} as const

export { env }
export type ClientEnv = typeof env
