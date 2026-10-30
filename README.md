<a href="https://chat.brodin.dev">
  <img alt="Nathan's AI — ask anything about Nathan Brodin" src="https://chat.brodin.dev/og" align="center">
  <h1 align="center">Nathan's AI</h1>
</a>

<p align="center">
It’s my portfolio, reimagined as a chat conversation, answered by AI.
</p>

<p align="center">
  <a href="https://github.com/NathanBrodin/Chat/stargazers"><img src="https://shieldcn.dev/github/stars/NathanBrodin/Chat.svg?variant=secondary&size=xs" alt="GitHub stars" /></a>
  <a href="https://github.com/NathanBrodin/Chat/forks"><img src="https://shieldcn.dev/github/forks/NathanBrodin/Chat.svg?variant=secondary&size=xs" alt="GitHub forks" /></a>
  <a href="https://github.com/NathanBrodin/Chat/blob/main/LICENSE"><img src="https://shieldcn.dev/github/license/NathanBrodin/Chat.svg?variant=secondary&size=xs" alt="License" /></a>
</p>

## Features

- Streaming chat with markdown rendering and shadcn/typeset
- Tool calling
- Web search via OpenRouter's web search server tool
- Web fetch via the AI SDK's first-party web fetch tool, with HTML-to-markdown conversion and SSRF protections
- Human-in-the-loop questionnaire. The model can ask clarifying questions, answered with the shadcn questionnaire component
- Per-IP rate limiting on `/api/chat` with Upstash Redis + `@upstash/ratelimit`
- Drizzle ORM + Neon PostgreSQL chat persistence
- Server-rendered SEO surface: JSON-LD, canonical metadata, sitemap, robots, `llms.txt`, manifest, and dynamic OG images
- Title animation from [@jh3yy](https://x.com/jh3yy/status/1849062440773820747)

## Deploy

The [vite config](./vite.config.ts) uses [Nitro](https://nitro.build/) by default, which supports many [deployment presets](https://nitro.build/deploy) like Netlify, Vercel, Node.js, and more. Refer to the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for more information.

Set the following in your hosting provider's environment variables:

- `OPENROUTER_API_KEY`, create one at [openrouter.ai/keys](https://openrouter.ai/keys).
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, create a Redis database at [console.upstash.com](https://console.upstash.com), then copy the REST URL and REST token from the database details (or use the Vercel Upstash integration, which sets them automatically).
- `DATABASE_URL` and `GITHUB_API_TOKEN` — see [`.env.schema`](./.env.schema), which is the source of truth for every variable. Use your Neon project's pooled connection string for `DATABASE_URL`.

After the first deploy, verify the domain in Google Search Console and Bing Webmaster Tools, then submit `https://chat.brodin.dev/sitemap.xml`.

## Local development

#### Prerequisites

- [Node.js](https://nodejs.org/en/download) >= 24
- [pnpm](https://pnpm.io/installation) >= 12
- [Vite Plus](https://viteplus.dev/guide/#install-vp) (`vp`)

#### Setup

```bash
vp install
```

Create a [Neon](https://neon.tech) project, then create a `.env.local` file with your values based on [`.env.schema`](./.env.schema). Copy the pooled connection string into `DATABASE_URL`, then validate the environment:

```sh
vpr env:load
```

Create an OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys) and a Redis database at [console.upstash.com](https://console.upstash.com).

Generate the initial migration with drizzle-kit, then apply it to your Neon database:

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

That's it, you are all set!
If you run into any problems or have any questions, please hesitate to ask me.

## Configuration

[Varlock](https://varlock.dev/) keeps the environment-variable contract in `.env.schema` and generates types from it. Put local values, including secrets, in the uncommitted `.env.local`, then run `vpr env:load` to validate them.

In application code, `import { ENV } from "varlock/env"` instead of reading `process.env` directly.

The model is defined in [src/lib/chat/model.ts](src/lib/chat/model.ts), together with its context window and output limit.

### Rate limit

`/api/chat` is rate-limited per client IP with [`@upstash/ratelimit`](https://github.com/upstash/ratelimit-js) backed by Upstash Redis (`Redis.fromEnv()`).

Current windows, in [src/routes/api/chat/route.ts](src/routes/api/chat/route.ts):

```ts
Ratelimit.slidingWindow(5, "30s") // burst: 5 requests per 30 seconds
Ratelimit.slidingWindow(50, "24h") // daily: 50 requests per day
```

Both limits are keyed by the first IP in the `x-forwarded-for` header (requests without the header share a single fallback bucket). Exceeding either returns `429` with `{ "error": "Ratelimited" }`. Tune the numbers there to match your budget — see the Security section below.

## Security

The `/api/chat` route is **public**: every allowed request spends your OpenRouter credits. It is rate-limited (see Configuration above).

- **Rate limit is per-IP, not global.** One IP is capped at 50 requests/day with the default windows, but N IPs (botnet, rotating proxies) get N× the budget.
- **Cap spend.** Keep an [OpenRouter spend limit](https://openrouter.ai/settings/limits) as a backstop.
- **Add a WAF** if abuse appears: add firewall rules from your hosting provider in front of `/api/chat`.
- Requests without an `x-forwarded-for` header share one fallback bucket, so they throttle each other — expected on local dev, suspicious in production logs.
- **Web fetch can request any public URL.** It blocks localhost, private, reserved, and cloud metadata addresses, including redirects and DNS-resolved addresses, and caps response size. Fetched content is untrusted and can contain prompt injections; set `requireUrlInUserMessage: true` in [src/lib/chat/tools/web_fetch.ts](src/lib/chat/tools/web_fetch.ts) so the model can only fetch URLs that appear in user messages.

The route already validates the request body, caps output tokens and step count, and aborts generation on client disconnect — but those bound a single request, not overall volume.

## How it works

- [src/routes/api/chat/route.ts](src/routes/api/chat/route.ts) rate-limits by IP with Upstash, then streams responses with `streamText` behind a TanStack Start API route (server handlers)
- [src/components/chat/](src/components/chat) renders the conversation with `useChat` and coss chat primitives, entry at [src/components/chat/index.tsx](src/components/chat/index.tsx), served by the [`/` route](src/routes/index.tsx).
- [src/lib/chat/agent/nathan.ts](src/lib/chat/agent/nathan.ts) defines the `ToolLoopAgent` — model, instructions, and step limit — and wires in the tools.
- [src/lib/chat/tools/](src/lib/chat/tools) defines the tools — one file per tool (the filename is the model-facing tool name), composed in [src/lib/chat/tools/index.ts](src/lib/chat/tools/index.ts): a server-executed GitHub repo lookup, web fetch, the interactive `ask_user` questionnaire, and provider-native web search.

## Tool parts

Assistant messages are a list of typed parts. [src/components/chat/chat-message.tsx](src/components/chat/chat-message.tsx) switches on `part.type` and delegates each one to a component in [src/components/chat/parts/](src/components/chat/parts):

| Part type          | Component                                                              | Renders                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`             | [text-part.tsx](src/components/chat/parts/text-part.tsx)               | Markdown via react-markdown and coss typeset.                                                                                                         |
| `tool-github_repo` | [github-repo-part.tsx](src/components/chat/parts/github-repo-part.tsx) | A spinner while the lookup runs, then a linked stat line (stars, forks, language).                                                                    |
| `tool-web_search`  | [web-search-part.tsx](src/components/chat/parts/web-search-part.tsx)   | A "Searching the web…" status while the search runs, then a persistent "Searched the web" line per search.                                            |
| `tool-web_fetch`   | [web-fetch-part.tsx](src/components/chat/parts/web-fetch-part.tsx)     | A "Reading…" status while the page loads, then a collapsible summary with a markdown preview and an external link.                                    |
| `tool-ask_user`    | [ask-user-part.tsx](src/components/chat/parts/ask-user-part.tsx)       | The answered questions inline. Pending questions render in [question-card.tsx](src/components/chat/question-card.tsx), pinned to the scroller bottom. |
| `source-url`       | [sources-part.tsx](src/components/chat/parts/sources-part.tsx)         | Web search citations, deduped into a "Searched N websites" drawer once the message finishes streaming.                                                |

Tool parts move through states as the stream progresses — `input-streaming` → `input-available` → `output-available` (or `output-error`) — and each component switches on `part.state` to show progress, results, and failures.

### Adding your own tool

1. Create `src/lib/chat/tools/<name>.ts` (the filename is the model-facing tool name) exporting a `tool()` with a `description`, an `inputSchema`, and an `execute` function (omit `execute` for tools the user answers in the UI, like `ask_user`), then register it in [src/lib/chat/tools/index.ts](src/lib/chat/tools/index.ts).
2. Add a part component in [src/components/chat/parts/](src/components/chat/parts) and a `case "tool-<name>"` in [chat-message.tsx](src/components/chat/chat-message.tsx).

Message types are inferred from the tool definitions via `InferUITools`, so `part.input` and `part.output` are fully typed in your part component — renaming a tool field is a build error, not a silent `undefined`.

## Logging

[evlog](https://www.evlog.dev/) is wired into the app through Nitro and emits one structured event per request. Chat requests also emit a correlated `chat.ai` event when the stream ends, because Nitro v3 logs the request before streamed AI usage is known. Add a [drain](https://www.evlog.dev/integrate/adapters/overview) when production needs logs sent to your chosen provider.

## SEO & GEO

The indexable pages are `/`, `/about`, and `/privacy`. Conversation routes are `noindex` and excluded from the sitemap.

Machine-readable endpoints:

- [`/robots.txt`](https://chat.brodin.dev/robots.txt) — crawl rules and sitemap
- [`/sitemap.xml`](https://chat.brodin.dev/sitemap.xml) — the three indexable pages
- [`/llms.txt`](https://chat.brodin.dev/llms.txt) and [`/llms-full.txt`](https://chat.brodin.dev/llms-full.txt) — AI-readable site index and app reference
- [`/llms.md`](https://chat.brodin.dev/llms.md) — markdown version of the site index
- [`/about.md`](https://chat.brodin.dev/about.md) and [`/privacy.md`](https://chat.brodin.dev/privacy.md) — markdown versions of the content pages
- [`/manifest.webmanifest`](https://chat.brodin.dev/manifest.webmanifest) — install metadata and icons
- [`/og`](https://chat.brodin.dev/og) — dynamic 1200×630 social card

The public pages (`/`, `/about`, `/privacy`) also negotiate content. Requests that include `Accept: text/markdown` receive markdown — the homepage returns the site index — while browsers asking for HTML get the app. Both variants send `Vary: Accept` so shared caches keep them separate.

The canonical `Person` entity lives on [brodin.dev](https://brodin.dev). Chat's JSON-LD references `https://brodin.dev/#person` rather than defining a competing profile.

When page content changes, update `lastModified` in [`src/lib/seo.ts`](./src/lib/seo.ts). If the logo changes, run `vpr icons` to regenerate the favicon and PWA icon set.

## Scripts

Check [package.json](./package.json) for the full list of available scripts.

- **`db`** - Run [drizzle-kit](https://orm.drizzle.team/docs/kit-overview) commands. (e.g. `vpr db generate`, `vpr db studio`)
- **`ui`** - The shadcn/ui CLI. (e.g. `vpr ui add button`)
- **`icons`** - Regenerate the favicon, Apple touch icon, and PWA icons with [`scripts/generate-icons.mjs`](./scripts/generate-icons.mjs).
- **`format`**, **`lint`** - Run Oxfmt and Oxlint, or both via `vpr check`.
- **`deps`** - Selectively upgrade dependencies via taze. Dependency versions are pinned, so run `vpr deps` to selectively upgrade packages.

#### Utilities

- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx), [`theme-provider.tsx`](./src/components/theme-provider.tsx) - A theme toggle and provider for toggling between light and dark mode (press `t` anywhere outside a text field to toggle).

## Issue watchlist

- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Nitro v3 beta](https://nitro.build/blog/v3-beta) - The app is configured with Nitro v3 beta by default.
- [evlog Nitro v3 streaming](https://github.com/evloghq/evlog/pull/433) - Nitro v3 emits request events at response headers, so stream-end AI usage is logged as a separate correlated `chat.ai` event.
- [Drizzle ORM v1 RC](https://orm.drizzle.team/docs/relations-v1-v2) - Drizzle ORM v1 is in RC with relations v2.

## License

MIT, see [LICENSE](./LICENSE).
