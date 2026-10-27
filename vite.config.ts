import path from "node:path"

import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { varlockVitePlugin } from "@varlock/vite-integration"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { type BuildEnvironmentOptions, defineConfig, lazyPlugins } from "vite-plus"

import { version } from "./package.json"

type OnLog = NonNullable<NonNullable<BuildEnvironmentOptions["rolldownOptions"]>["onLog"]>

// Vendor "use client" directives are meaningless for Tanstack.
const ignoreDependencyDirectives: OnLog = (level, log, defaultHandler) => {
  if (level === "warn" && log.code === "MODULE_LEVEL_DIRECTIVE") return
  defaultHandler(level, log)
}

// https://viteplus.dev/config/
export default defineConfig(() => ({
  // Git hooks for staged files - https://viteplus.dev/guide/commit-hooks
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
  },

  // Oxfmt - https://oxc.rs/docs/guide/usage/formatter/config.html
  fmt: {
    tabWidth: 2,
    semi: false,
    printWidth: 100,
    singleQuote: false,
    endOfLine: "lf",
    trailingComma: "all",
    sortImports: {},
    sortTailwindcss: {
      stylesheet: "./src/styles.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: true,
    ignorePatterns: [
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lock",
      "routeTree.gen.ts",
      ".tanstack-start/",
      ".tanstack/",
      "drizzle/",
      "migrations/",
      ".drizzle/",
      ".cache",
      "worker-configuration.d.ts",
      ".vercel",
      ".output",
      ".wrangler",
      ".netlify",
      "dist",
      ".agents/skills/",
      "env.d.ts",
    ],
  },

  // Oxlint - https://oxc.rs/docs/guide/usage/linter/config
  lint: {
    plugins: ["typescript", "react", "react-perf", "jsx-a11y"],
    env: {
      builtin: true,
      node: true,
      browser: true,
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      // Plugins with "/" in name have to be aliased for now
      // Issue: https://github.com/oxc-project/oxc/issues/14557
      {
        name: "eslint-tanstack-router",
        specifier: "@tanstack/eslint-plugin-router",
      },
      {
        name: "eslint-tanstack-query",
        specifier: "@tanstack/eslint-plugin-query",
      },
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    ],
    categories: {
      correctness: "warn",
    },
    rules: {
      "vite-plus/prefer-vite-plus-imports": "warn",

      "no-deprecated": "warn",
      "typescript/no-floating-promises": "off",
      "typescript/no-misused-spread": "off",

      "jsx-a11y/prefer-tag-over-role": "off",

      "eslint-tanstack-router/create-route-property-order": "warn",

      "eslint-tanstack-query/exhaustive-deps": "warn",
      "eslint-tanstack-query/stable-query-client": "warn",
      "eslint-tanstack-query/no-rest-destructuring": "warn",
      "eslint-tanstack-query/no-unstable-deps": "warn",
      "eslint-tanstack-query/infinite-query-property-order": "warn",
      "eslint-tanstack-query/no-void-query-fn": "warn",
      "eslint-tanstack-query/mutation-property-order": "warn",
    },
    ignorePatterns: [
      "dist",
      ".wrangler",
      ".vercel",
      ".netlify",
      ".output",
      "build/",
      "worker-configuration.d.ts",
      "scripts/",
      ".agents/skills/",
      "env.d.ts",
    ],
  },

  // Vite config - https://vite.dev/config/
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  optimizeDeps: {
    // The web fetch tool is server-only, but the dev dependency scanner follows
    // its imports from the chat route. linkedom and defuddle are Node-only and
    // their browser builds do not expose the same exports.
    exclude: ["@ai-sdk/tool-web-fetch", "linkedom", "@acemir/cssom", "defuddle"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                // Keep the heavy AI SDK out of the route chunk.
                { name: "ai-sdk", test: /node_modules[\\/](?:ai|@ai-sdk)[\\/]/ },
              ],
            },
          },
        },
      },
    },
    ssr: {
      build: {
        rolldownOptions: { onLog: ignoreDependencyDirectives },
      },
    },
  },
  plugins: lazyPlugins(() => [
    devtools({
      // https://tanstack.com/devtools/latest/docs/vite-plugin#console-piping
      consolePiping: { enabled: false },
    }),
    // https://varlock.dev/integrations/tanstack-start/
    varlockVitePlugin({
      // https://varlock.dev/integrations/vite/#ssr-code-injection
      ssrInjectMode: "resolved-env",
    }),
    tanstackStart(),
    // https://tanstack.com/start/latest/docs/framework/react/guide/hosting
    nitro(), // configured in nitro.config.ts
    viteReact({ compiler: true }),
    tailwindcss(),
  ]),
}))
