# Agent Instructions

This is an AI Chat App.

## Tech Stack & Conventions

- **Framework**: React 19 + React Compiler + TanStack Router + TanStack Start (SSR)
- **Styling**: Tailwind CSS v4
- **UI Components**: Base UI + shadcn components
- **Validation**: Zod
- **Rule**: Rely on the React Compiler; avoid manual memoization (`useMemo`, `useCallback`) unless strictly necessary.

## Useful Commands

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task.

### Develop

- `vp dev` - Run the development server
- `vp check` - Run format, lint, and TypeScript type checks
- `vp test` - Run tests

### Build

- `vp build` - Build for production
- `vp preview` - Preview production build

### Manage Dependencies

- `vp add <package>` - Add packages to dependencies
- `vp remove <package>` - Remove packages from dependencies
- `vp update` - Update packages to latest versions

## Backend

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->
