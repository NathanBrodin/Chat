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

  rolldownConfig: {
    onLog(level, log, defaultHandler) {
      if (level === "warn" && ignoredWarningCodes.has(log.code ?? "")) return
      defaultHandler(level, log)
    },
  },

  // Shiki's Emscripten onig.wasm can't be parsed; highlighting uses the JS engine.
  wasm: { silent: true },

  /**
   * TODO(security): Review production security headers before deployment.
   *
   * App-level policies such as CSP, Permissions-Policy, X-Frame-Options /
   * frame-ancestors, COOP, Referrer-Policy, and X-Content-Type-Options are
   * intentionally not configured by the Cove Stack template because safe values
   * depend on the app's embedding requirements, browser APIs, integrations, and
   * content.
   */
})
