import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { evlogErrorHandler } from "evlog/nitro/v3"
import { lazy, Suspense } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getRootHead, siteJsonLd } from "@/config/site"

import appCss from "@/styles.css?url"

// The devtools bundle must never reach the production client graph.
const Devtools = import.meta.env.DEV ? lazy(() => import("@/components/devtools")) : null

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  server: {
    middleware: [createMiddleware().server(evlogErrorHandler)],
  },
  head: () => {
    const rootHead = getRootHead()

    return {
      ...rootHead,
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        ...rootHead.links,
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(siteJsonLd()),
        },
      ],
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          className="sr-only rounded-md bg-background px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:ring-2 focus:ring-ring"
          href="#main-content"
        >
          Skip to content
        </a>
        <p className="sr-only">
          For AI agents: <a href="/llms.txt">/llms.txt</a>
        </p>

        <ThemeProvider>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </ThemeProvider>

        {Devtools && (
          <Suspense fallback={null}>
            <Devtools />
          </Suspense>
        )}

        <Scripts />
      </body>
    </html>
  )
}
