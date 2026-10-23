# chatbot-template

A minimal chatbot template built with TanStack [Start](https://tanstack.com/start/latest), the [AI SDK](https://ai-sdk.dev), [coss UI](https://coss.com/ui), [coss chat](https://coss.com/ui/chat) and [OpenRouter](https://openrouter.ai).

Forked from [shadcn-ui/chatbot-template](https://github.com/shadcn-ui/chatbot-template), with the UI migrated to coss and the framework migrated from Next.js to TanStack Start using [cove](https://github.com/mugnavo/cove).

## Features

- Streaming chat with markdown rendering and shadcn/typeset
- Tool calling example
- Web search via OpenRouter's web search server tool
- Human-in-the-loop questionnaire. The model can ask clarifying questions, answered with the shadcn questionnaire component
- Per-IP rate limiting on `/api/chat` with Upstash Redis + `@upstash/ratelimit`
- Better Auth starter (email + GitHub/Google OAuth) with login/signup pages, persisted with Drizzle ORM + PostgreSQL

## Deploy

The [vite config](./vite.config.ts) uses [Nitro](https://nitro.build/) by default, which supports many [deployment presets](https://nitro.build/deploy) like Netlify, Vercel, Node.js, and more. Refer to the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for more information.

Set the following in your hosting provider's environment variables:

- `OPENROUTER_API_KEY`, create one at [openrouter.ai/keys](https://openrouter.ai/keys).
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, create a Redis database at [console.upstash.com](https://console.upstash.com), then copy the REST URL and REST token from the database details (or use the Vercel Upstash integration, which sets them automatically).
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `VITE_BASE_URL` — see [`.env.schema`](./.env.schema), which is the source of truth for every variable.

## Local development

#### Prerequisites

- [Node.js](https://nodejs.org/en/download) >= 24
- [pnpm](https://pnpm.io/installation) >= 12
- [Vite Plus](https://viteplus.dev/guide/#install-vp) (`vp`)

#### Setup

```bash
vp install
```

Then create a `.env.local` file with your values, based on [`.env.schema`](./.env.schema), then validate them:

```sh
vpr env:load
```

Create an OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys) and a Redis database at [console.upstash.com](https://console.upstash.com).

Generate the initial migration with drizzle-kit, then apply to your database:

```sh
vpr db generate
vpr db migrate
```

https://orm.drizzle.team/docs/migrations

Start the dev server:

```bash
vpr dev
```

The development server should now be running at [http://localhost:3000](http://localhost:3000).

## Configuration

| Env var                    | Required | Description                                                                      |
| -------------------------- | -------- | -------------------------------------------------------------------------------- |
| `OPENROUTER_API_KEY`       | Yes      | OpenRouter API key. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). |
| `UPSTASH_REDIS_REST_URL`   | Yes      | Upstash Redis REST URL for rate limiting. From your database details.            |
| `UPSTASH_REDIS_REST_TOKEN` | Yes      | Upstash Redis REST token for rate limiting. From your database details.          |
| `DATABASE_URL`             | Yes      | PostgreSQL connection URL. Run `docker compose up -d` for the local database.    |
| `BETTER_AUTH_SECRET`       | Yes      | Better Auth signing secret. Generate one with `vpr auth:secret`.                 |
| `VITE_BASE_URL`            | Yes      | Public origin used by the browser and Better Auth.                               |

[Varlock](https://varlock.dev/) keeps the environment-variable contract in `.env.schema` and generates types from it. Put local values, including secrets, in the uncommitted `.env.local`, then run `vpr env:load` to validate them.

In application code, `import { ENV } from "varlock/env"` instead of reading `process.env` directly.

The model is hardcoded to `~z-ai/glm-flash-latest` in [src/routes/api/chat/route.ts](src/routes/api/chat/route.ts).

### Rate limit

`/api/chat` is rate-limited per client IP with [`@upstash/ratelimit`](https://github.com/upstash/ratelimit-js) backed by Upstash Redis (`Redis.fromEnv()`).

Current windows, in [src/routes/api/chat/route.ts](src/routes/api/chat/route.ts):

```ts
Ratelimit.slidingWindow(5, "30s") // burst: 5 requests per 30 seconds
Ratelimit.slidingWindow(50, "24h") // daily: 50 requests per day
```

Both limits are keyed by the first IP in the `x-forwarded-for` header (requests without the header share a single fallback bucket). Exceeding either returns `429` with `{ "error": "Ratelimited" }`. Tune the numbers there to match your budget — see the Security section below.

## Security

The `/api/chat` route is **public and unauthenticated**: every allowed request spends your OpenRouter credits. It is rate-limited (see Configuration above).

- **Rate limit is per-IP, not global.** One IP is capped at 50 requests/day with the default windows, but N IPs (botnet, rotating proxies) get N× the budget.
- **Cap spend.** Keep an [OpenRouter spend limit](https://openrouter.ai/settings/limits) as a backstop.
- **Add auth or WAF** if abuse appears: require login for heavy use, and/or add firewall rules from your hosting provider in front of `/api/chat`.
- Requests without an `x-forwarded-for` header share one fallback bucket, so they throttle each other — expected on local dev, suspicious in production logs.

The route already validates the request body, caps output tokens and step count, and aborts generation on client disconnect — but those bound a single request, not overall volume.

## How it works

- [src/routes/api/chat/route.ts](src/routes/api/chat/route.ts) rate-limits by IP with Upstash, then streams responses with `streamText` behind a TanStack Start API route (server handlers)
- [src/components/chat/](src/components/chat) renders the conversation with `useChat` and coss chat primitives, entry at [src/components/chat/index.tsx](src/components/chat/index.tsx), served by the [`/` route](src/routes/index.tsx).
- [src/tools/](src/tools) defines the tools — one file per tool (the filename is the model-facing tool name), composed in [src/tools/index.ts](src/tools/index.ts): a server-executed GitHub repo lookup, the interactive `ask_user` questionnaire, and provider-native web search.

## Tool parts

Assistant messages are a list of typed parts. [src/components/chat/chat-message.tsx](src/components/chat/chat-message.tsx) switches on `part.type` and delegates each one to a component in [src/components/chat/parts/](src/components/chat/parts):

| Part type          | Component                                                              | Renders                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`             | [text-part.tsx](src/components/chat/parts/text-part.tsx)               | Markdown via react-markdown and coss typeset.                                                                                                         |
| `tool-github_repo` | [github-repo-part.tsx](src/components/chat/parts/github-repo-part.tsx) | A spinner while the lookup runs, then a linked stat line (stars, forks, language).                                                                    |
| `tool-web_search`  | [web-search-part.tsx](src/components/chat/parts/web-search-part.tsx)   | A "Searching the web…" status while the search runs, then a persistent "Searched the web" line per search.                                            |
| `tool-ask_user`    | [ask-user-part.tsx](src/components/chat/parts/ask-user-part.tsx)       | The answered questions inline. Pending questions render in [question-card.tsx](src/components/chat/question-card.tsx), pinned to the scroller bottom. |
| `source-url`       | [sources-part.tsx](src/components/chat/parts/sources-part.tsx)         | Web search citations, deduped into a "Searched N websites" drawer once the message finishes streaming.                                                |

Tool parts move through states as the stream progresses — `input-streaming` → `input-available` → `output-available` (or `output-error`) — and each component switches on `part.state` to show progress, results, and failures.

### Adding your own tool

1. Create `src/tools/<name>.ts` (the filename is the model-facing tool name) exporting a `tool()` with a `description`, an `inputSchema`, and an `execute` function (omit `execute` for tools the user answers in the UI, like `ask_user`), then register it in [src/tools/index.ts](src/tools/index.ts).
2. Add a part component in [src/components/chat/parts/](src/components/chat/parts) and a `case "tool-<name>"` in [chat-message.tsx](src/components/chat/chat-message.tsx).

Message types are inferred from the tool definitions via `InferUITools`, so `part.input` and `part.output` are fully typed in your part component — renaming a tool field is a build error, not a silent `undefined`.

## Logging

[evlog](https://www.evlog.dev/) is wired into the app through Nitro and emits one structured event per request. Add a [drain](https://www.evlog.dev/integrate/adapters/overview) when production needs logs sent to your chosen provider.

## Scripts

Check [package.json](./package.json) for the full list of available scripts.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/db/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/auth/auth.ts).
- **`db`** - Run [drizzle-kit](https://orm.drizzle.team/docs/kit-overview) commands. (e.g. `vpr db generate`, `vpr db studio`)
- **`ui`** - The shadcn/ui CLI. (e.g. `vpr ui add button`)
- **`format`**, **`lint`** - Run Oxfmt and Oxlint, or both via `vpr check`.
- **`deps`** - Selectively upgrade dependencies via taze. Dependency versions are pinned, so run `vpr deps` to selectively upgrade packages.

#### Utilities

- [`auth/middleware.ts`](./src/lib/auth/middleware.ts) - Sample middleware for enforcing authentication on server functions & API routes.
- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx), [`theme-provider.tsx`](./src/components/theme-provider.tsx) - A theme toggle and provider for toggling between light and dark mode (press `d` anywhere outside a text field to toggle).

## Issue watchlist

- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Nitro v3 beta](https://nitro.build/blog/v3-beta) - The app is configured with Nitro v3 beta by default.
- [Drizzle ORM v1 RC](https://orm.drizzle.team/docs/relations-v1-v2) - Drizzle ORM v1 is in RC with relations v2.

## License

Code in this template is public domain via [Unlicense](./LICENSE). Feel free to remove or replace for your own project.
