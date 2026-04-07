import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite-plus'

const config = defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: ['react', 'typescript'],
    rules: {
      'no-floating-promises': 'off',
    },
  },
  fmt: {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    sortTailwindcss: {
      stylesheet: './src/styles.css',
      function: ['clsx', 'cn'],
      preserveWhitespace: true,
    },
    sortImports: {
      groups: [
        'type-import',
        ['value-builtin', 'value-external'],
        'type-internal',
        'value-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown',
      ],
    },
    ignorePatterns: ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'src/routeTree.gen.ts'],
  },
  ssr: {
    noExternal: ['@convex-dev/better-auth'],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
  optimizeDeps: {
    include: ['lucide-react'],
  },
})

export default config
