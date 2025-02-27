import { withSentryConfig } from "@sentry/nextjs"
import { withContentlayer } from "next-contentlayer"

const nextConfig: import("next").NextConfig = {}

module.exports = withSentryConfig(withContentlayer(nextConfig), {
  org: "brodindev",
  project: "chat",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
})
