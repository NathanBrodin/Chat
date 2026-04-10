import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ConvexProvider } from 'convex/react'

import { env } from './env'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL, { expectAuth: true })
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, convexQueryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => (
      <ConvexProvider client={convexQueryClient.convexClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConvexProvider>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient: queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
