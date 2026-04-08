import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { ThemeProvider } from '@lonik/themer'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import { NotFound } from '@/components/not-found'
import { getAuth } from '@/lib/auth'
import { AuthProvider } from '@/providers/auth'

import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Chat | Nathan's AI",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth()
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }
    return {
      isAuthenticated: !!token,
      token,
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return <NotFound />
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased">
        <ThemeProvider disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
