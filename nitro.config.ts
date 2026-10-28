import { auditRedactPreset, type RedactConfig } from "evlog"
import evlog from "evlog/nitro/v3"
import { defineConfig } from "nitro"

const redact = {
  ...auditRedactPreset,
  paths: [...(auditRedactPreset.paths ?? []), "cookies"],
} satisfies RedactConfig

// Nitro's built-in ignored warning codes, plus vendor "use client" directives.
const ignoredWarningCodes = new Set([
  "EVAL",
  "CIRCULAR_DEPENDENCY",
  "THIS_IS_UNDEFINED",
  "EMPTY_BUNDLE",
  "MODULE_LEVEL_DIRECTIVE",
])

export default defineConfig({
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: "web" },
      redact,
    }),
  ],

  routeRules: {
    /**
     * Baseline response hardening for every route. There is intentionally no
     * enforcing Content-Security-Policy: the app relies on inline theme scripts,
     * Rive WebGL/WASM, and third-party analytics that a strict policy would
     * break. Follow up with a report-only CSP, collect violations, then enforce.
     */
    "**": {
      headers: {
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Frame-Options": "DENY",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },

    // API responses are never indexable and must never be cached.
    "/api/**": {
      headers: {
        "X-Robots-Tag": "noindex",
        "Cache-Control": "no-store",
      },
    },

    // Public conversations stay shareable but are excluded from search results.
    "/conversations": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    },
    "/conversations/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    },

    // Signed-in account pages.
    "/app": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    },
    "/app/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    },

    // Auth pages may pass link equity but must not be indexed or cached.
    "/login": {
      headers: {
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": "private, no-store",
      },
    },
    "/signup": {
      headers: {
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": "private, no-store",
      },
    },

  },

  rolldownConfig: {
    onLog(level, log, defaultHandler) {
      if (level === "warn" && ignoredWarningCodes.has(log.code ?? "")) return
      defaultHandler(level, log)
    },
  },

  // Shiki's Emscripten onig.wasm can't be parsed; highlighting uses the JS engine.
  wasm: { silent: true },
})
