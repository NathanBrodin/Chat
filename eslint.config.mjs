import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Vendored coss registry files follow upstream Base UI patterns that
    // trip Next 16's react-compiler lint rules (latest-ref sync, DOM flags
    // in layout effects, skeleton useMemo). Keep them pristine so
    // `shadcn add @coss/*` updates apply cleanly.
    files: [
      "components/ui/sidebar.tsx",
      "hooks/use-composer-editor.ts",
      "lib/composer-editor.ts",
      "components/chat/chat-conversation.tsx",
    ],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
])

export default eslintConfig
