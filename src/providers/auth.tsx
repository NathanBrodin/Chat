import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { useRouteContext } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/auth-client'
import { Route } from '@/routes/__root'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const context = useRouteContext({ from: Route.id })

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={context.token}
    >
      {children}
    </ConvexBetterAuthProvider>
  )
}
