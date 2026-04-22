# [Chat | Nathan's AI](https://chat.brodin.dev) &middot; [![GitHub License](https://img.shields.io/github/license/nathanbrodin/chat?label=License)](https://github.com/nathanbrodin/chat/blob/main/LICENSE) ![GitHub Repo Views](https://gitviews.com/repo/nathanbrodin/chat.svg?style=flat&label-color=%23555&color=%23f59e0b)

A personal AI that knows you well enough to get it right.
Built around a skills system where you define your context once, and the AI uses it every time. The more you give it, the more personal it gets.

→ Check out the live site: [chat.brodin.dev](https://chat.brodin.dev)

![OG Image](public/og.png)

## Overview

### Stack

- [Vite+](https://viteplus.dev/)
- [React 19 + React Compiler](https://react.dev)
- [Tanstack Start](https://tanstack.com/start/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [Base UI](https://base-ui.com)
- [coss ui](https://coss.com/ui)
- [Convex](https://convex.dev)

### Features

- **Skills system**: Build a personal profile with your habits, goals, preferences, and context. The AI pulls from it on demand. Kindoff a personal RAG.
- **Tools**: Todo list, web search, fetch... Enough to actually get things done without leaving the chat.
- **Multi-model**: Powered by OpenRouter. Pick your model, or let the defaults handle it.
- **[username]'s AI**: The product name adapts to whoever's logged in. It's yours, and it shows.
- **Nathan's context**: A side feature, which was the og project. Any user can ask the AI about me directly: my work, projects, experience.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **[Node.js](https://nodejs.org/)**
- **[Git](https://git-scm.com/)**
- **[pnpm](https://pnpm.io/)**
- **[Vite+ CLI](https://viteplus.dev/guide/)** _(Note: Vite+ acts as the package manager for this project)._

### Installation & Setup

**1. Clone the repository**

```bash
git clone https://github.com/NathanBrodin/Chat.git
cd Chat
```

**2. Set up environment variables**

- Create a Convex Project
- Get an OpenRouter API Key
- Generate a Better Auth Secret key
- Create an `.env.local` file in the root of the project and add your token:

```env

```

**3. Install dependencies and run**

```bash
vp install
vp dev
```

> The application should now be running at [http://localhost:3000](http://localhost:3000)
