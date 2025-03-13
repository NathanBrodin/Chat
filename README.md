<a href="https://chat.brodin.dev">
  <img alt="Nathan's AI demo" src="./.github/nathan-s-ai.gif" align="center">
  <h1 align="center">Nathan's AI</h1>
</a>

<p align="center">
It’s my portfolio, reimagined as a chat conversation, answered by AI.
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#sources-of-inspiration"><strong>Sources of Inspiration</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

Nathan's AI is a unique twist on the traditional portfolio. Instead of scrolling through pages of information, visitors can simply ask questions to learn about my career, skills, projects, and experiences. Built with Next.js, Tailwind CSS, and Vercel’s AI SDK, this chatbot acts as an interactive resume, letting you explore my journey in a conversational way.

## Tech Stack

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Supports Anthropic (default), OpenAI, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history
- [@upstash/ratelimit](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)
  - Preventing excessive usage of the chat
- [motion](https://motion.dev)
  - A modern animation library for JavaScript and React
  - Clean and easy to use animations

## Sources of Inspiration

I am proud of my designs, but it doesn't came from the pure source of my imagination. Here you can find links of website I used to create my own design.

- Empty Screen messages: [Cal.com](https://cal.com/)
- Messages animation: [Build UI](https://buildui.com/recipes/animated-list)
- Title animation: [@jh3yy](https://x.com/jh3yy/status/1849062440773820747)
- Themes: [ui/jln](https://ui.jln.dev/)

## Deploy Your Own

You can deploy your own version of Nathan's AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnathanbrodin%2Fchat&env=ANTHROPIC_API_KEY,KV_URL,KV_REST_API_URL,KV_REST_API_TOKEN,KV_REST_API_READ_ONLY_TOKEN&demo-title=Nathan's%20AI&demo-description=Curious%20about%20Nathan%20Brodin%3F%20Ask%20his%20AI%20anything!&demo-url=https%3A%2F%2Fchat.brodin.dev)

### Setting up the chat's services

Nathan's AI depends on multiple services to function properly, and as you saw by deploying to Vercel, you need a few environment variables to make it work. Follow these steps to configure the necessary environment variables.

#### 1. AI Provider (Anthropic API)

Grab your [Anthropic API Key](https://console.anthropic.com/settings/keys) and paste it into your `.env.local` file:

```
ANTHROPIC_API_KEY="your-api-key-here"
```

Nathan's AI currently uses Anthropic, but you can switch to another provider by updating the model inside `streamText()` in [lib/chat/actions.tsx](./lib/chat/actions.tsx). For more details, check out the [AI SDK documentation](https://sdk.vercel.ai/docs/foundations/providers-and-models). If you switch providers, remember to update the relevant environment variables accordingly.

#### 2. Rate Limiting (Upstash)

To prevent users (or bots) from consuming all your AI credits in a caffeine-fueled chat spree, we use Upstash for rate limiting.

1. Create a Redis database on [Upstash](https://upstash.com/docs/redis/overall/getstarted).
2. Add these variables to your `.env.local` file:

```
KV_URL="your-kv-url"
KV_REST_API_URL="your-rest-api-url"
KV_REST_API_TOKEN="your-api-token"
KV_REST_API_READ_ONLY_TOKEN="your-read-only-token"
```

#### 3. Chat Storage (Neon Postgres)

If you want to save chat logs for fine-tuning responses (definitely not because you're nosy), you'll need a Postgres database.

1. Create a Postgres database on [Neon](https://neon.tech/).
2. Add your connection string to `.env.local`:

```
POSTGRES_URL="your-database-url"
```

#### 4. (Optional) Analytics (Openpanel)

Want to see if anyone is actually using your AI? Openpanel helps track visits and user interactions.

1. Get your client secret key from [Openpanel](https://openpanel.dev/).
2. Add it to your `.env.local` file:

```
OPENPANEL_CLIENT_SECRET="your-client-secret"
```

### Updating the AI Content

Customize the AI’s responses by replacing all content inside the [./content/\*\*](./content/) directory with your own experiences, education, or whatever makes your AI unique.

The content structure is defined in:

- [contentlayer.config.ts](./contentlayer.config.ts)
- [lib/chat/types.ts](lib/chat/types.ts)

Adapt these files as needed to fit your requirements.

### Renaming Nathan's AI

If your name happens to be Nathan, congratulations! The chatbot is already personalized for you. No changes needed.

For everyone else, you'll need to update all occurrences of its current name.

#### VIM Users:

Run a simple:

```
g/Nathan's AI/
```

This will show all occurrences so you can update them efficiently.

#### Non-VIM Users:

That's not my problem sorry, find your way's to replace it.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Nathan's AI locally. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
bun install
```

```bash
bun run dev
```

That's it, you are all set!
If you run into any problems or have any questions, please hesitate to ask me.
