# Nathan's AI

AI Chatbot that knows everything about me.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction)
- [@upstash/ratelimit](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)
- [framer-motion](https://www.framer.com/motion/)
- [Bun](https://bun.sh)

## Sources of Inspiration

- Empty Screen: [Cal.com](https://cal.com/)
- Messages animation: [Build UI](https://buildui.com/recipes/animated-list)
- Title animation: [@jh3yy](https://x.com/jh3yy/status/1849062440773820747)
- Themes: [ui/jln](https://ui.jln.dev/)
- Themes picker: [shadcn/ui](https://ui.shadcn.com/themes)

## Local Installation

- Clone the repository:

```bash
https://github.com/NathanBrodin/Chat.git
```

- Navigate to the project folder:

```bash
cd Chat
```

- Install packages using [Bun](https://bun.sh/docs/installation):

```bash
bun install
```

- Set up environment variables:

On macOS/Linux:

```bash
cp .env.example .env.local
```

On Windows:

```powershell
Copy-Item .env.example .env.local

```

- Get your Anthropic api key and paste it in `.env.local`.

- Create a kv database on [Vercel](https://vercel.com/storage/kv) and paste environment variables it in `.env.local`.

- Run the dev server:

```bash
bun run dev
```

That's it, you are all set!

## Deployment

This project is deployed on Vercel. Click the button below to deploy the chat in seconds!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnathanbrodin%2Fchat&env=ANTHROPIC_API_KEY,KV_URL,KV_REST_API_URL,KV_REST_API_TOKEN,KV_REST_API_READ_ONLY_TOKEN&demo-title=Nathan's%20AI&demo-description=Curious%20about%20Nathan%20Brodin%3F%20Ask%20his%20AI%20anything!&demo-url=https%3A%2F%2Fchat.brodin.dev)
