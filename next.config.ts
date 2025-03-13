import { withContentlayer } from "next-contentlayer"

import { fileURLToPath } from "node:url"
import createJiti from "jiti"
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./app/env")

const nextConfig: import("next").NextConfig = {
  experimental: {
    optimizePackageImports: ["shiki", "react-markdown", "marked"],
  },
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
