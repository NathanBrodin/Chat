# chatbot-template

A minimal chatbot template built with Next.js, the [AI SDK](https://ai-sdk.dev), [coss UI](https://coss.com/ui), [coss chat](https://coss.com/ui/chat) and [OpenRouter](https://openrouter.ai).

Forked from [shadcn-ui/chatbot-template](https://github.com/shadcn-ui/chatbot-template), with the UI migrated to coss.

<p>
  <a href="https://github.com/NathanBrodin/chatbot-template/stargazers"><img src="https://shieldcn.dev/github/stars/NathanBrodin/chatbot-template.svg?variant=secondary&size=xs" alt="GitHub stars" /></a>
  <a href="https://github.com/NathanBrodin/chatbot-template/forks"><img src="https://shieldcn.dev/github/forks/NathanBrodin/chatbot-template.svg?variant=secondary&size=xs" alt="GitHub forks" /></a>
  <a href="https://github.com/NathanBrodin/chatbot-template/blob/main/LICENSE"><img src="https://shieldcn.dev/github/license/NathanBrodin/chatbot-template.svg?variant=secondary&size=xs" alt="License" /></a>
</p>

## Features

- Streaming chat with markdown rendering and shadcn/typeset
- Tool calling example
- Web search via OpenRouter's web search server tool
- Human-in-the-loop questionnaire. The model can ask clarifying questions, answered with the shadcn questionnaire component

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNathanBrodin%2Fchatbot-template&project-name=chatbot-template&repository-name=chatbot-template)

Set `OPENROUTER_API_KEY` in your hosting provider's environment variables (create one at [openrouter.ai/keys](https://openrouter.ai/keys)).

## Local development

```bash
pnpm install
```

Then add your OpenRouter API key to `.env.local`:

```bash
cp .env.example .env.local
# then set OPENROUTER_API_KEY=...
```

Create a key at [openrouter.ai/keys](https://openrouter.ai/keys).

Start the dev server:

```bash
pnpm dev
```

## Configuration

| Env var              | Required | Description                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------- |
| `OPENROUTER_API_KEY` | Yes      | OpenRouter API key. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). |

The model is hardcoded to `minimax/minimax-m3.1-flash:free` in [app/api/chat/route.ts](app/api/chat/route.ts).

## Security

The `/api/chat` route is **public and unauthenticated** — every request spends your OpenRouter credits. That's fine for a personal demo, but before putting it in front of real traffic you should:

- **Rate limit it.** Add [Vercel Firewall / WAF](https://vercel.com/docs/security/vercel-waf) rules or [`@upstash/ratelimit`](https://github.com/upstash/ratelimit-js) so a single client can't drain your credits (denial-of-wallet).
- **Cap spend.** Set an [OpenRouter spend limit](https://openrouter.ai/settings/limits) as a backstop.
- **Add auth** if the chatbot isn't meant to be public.

The route already validates the request body, caps output tokens and step count, and aborts generation on client disconnect — but those bound a single request, not overall volume.

## How it works

- [app/api/chat/route.ts](app/api/chat/route.ts) streams responses with `streamText`
- [components/chat/](components/chat) renders the conversation with `useChat` and coss chat primitives, entry at [components/chat/index.tsx](components/chat/index.tsx).
- [tools/](tools) defines the tools — one file per tool (the filename is the model-facing tool name), composed in [tools/index.ts](tools/index.ts): a server-executed GitHub repo lookup, the interactive `ask_user` questionnaire, and provider-native web search.

## Tool parts

Assistant messages are a list of typed parts. [components/chat/chat-message.tsx](components/chat/chat-message.tsx) switches on `part.type` and delegates each one to a component in [components/chat/parts/](components/chat/parts):

| Part type          | Component                                                          | Renders                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`             | [text-part.tsx](components/chat/parts/text-part.tsx)               | Markdown via react-markdown and coss typeset.                                                                                                     |
| `tool-github_repo` | [github-repo-part.tsx](components/chat/parts/github-repo-part.tsx) | A spinner while the lookup runs, then a linked stat line (stars, forks, language).                                                                |
| `tool-web_search`  | [web-search-part.tsx](components/chat/parts/web-search-part.tsx)   | A "Searching the web…" status while the search runs, then a persistent "Searched the web" line per search.                                        |
| `tool-ask_user`    | [ask-user-part.tsx](components/chat/parts/ask-user-part.tsx)       | The answered questions inline. Pending questions render in [question-card.tsx](components/chat/question-card.tsx), pinned to the scroller bottom. |
| `source-url`       | [sources-part.tsx](components/chat/parts/sources-part.tsx)         | Web search citations, deduped into a "Searched N websites" drawer once the message finishes streaming.                                            |

Tool parts move through states as the stream progresses — `input-streaming` → `input-available` → `output-available` (or `output-error`) — and each component switches on `part.state` to show progress, results, and failures.

### Adding your own tool

1. Create `tools/<name>.ts` (the filename is the model-facing tool name) exporting a `tool()` with a `description`, an `inputSchema`, and an `execute` function (omit `execute` for tools the user answers in the UI, like `ask_user`), then register it in [tools/index.ts](tools/index.ts).
2. Add a part component in [components/chat/parts/](components/chat/parts) and a `case "tool-<name>"` in [chat-message.tsx](components/chat/chat-message.tsx).

Message types are inferred from the tool definitions via `InferUITools`, so `part.input` and `part.output` are fully typed in your part component — renaming a tool field is a build error, not a silent `undefined`.

## License

MIT — see [LICENSE](LICENSE).
