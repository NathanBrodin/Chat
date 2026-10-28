# Workflow

## Commands

- `vpr build`: Only as a standalone command for build/bundler issues or verifying production output
- `vpr lint`: Covers both type-aware linting and type checking. No need to run `tsc --noEmit`
- `vpr dev` runs indefinitely in watch mode
- `vpr db` for Drizzle Kit commands (e.g. `vpr db generate` to generate a migration)

Don't invoke a standalone build after every change. Use lint as the baseline.

## Formatting

Oxfmt (via Vite+) is configured for consistent code formatting via `vpr format`. It runs automatically on commit via Vite+ pre-commit hooks, so manual formatting is not necessary.
