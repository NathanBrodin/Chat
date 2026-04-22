import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { ThemeProvider } from '@lonik/themer'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import { ErrorComponent } from '@/components/error'
import { NotFound } from '@/components/not-found'
import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import { siteConfig, siteJsonLd } from '@/config/site'
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
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteConfig.title },
      { name: 'author', content: siteConfig.name },
      { name: 'keywords', content: siteConfig.keywords.join(', ') },
      { name: 'description', content: siteConfig.description },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#000000' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: siteConfig.url },
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:title', content: siteConfig.title },
      { property: 'og:description', content: siteConfig.description },
      { property: 'og:image', content: siteConfig.og },
      { property: 'og:locale', content: 'en_US' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: siteConfig.twitterHandle },
      { name: 'twitter:creator', content: siteConfig.twitterHandle },
      { name: 'twitter:title', content: siteConfig.title },
      { name: 'twitter:description', content: siteConfig.description },
      { name: 'twitter:image', content: siteConfig.og },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(siteJsonLd),
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
  errorComponent: ErrorComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased">
        <ThemeProvider disableTransitionOnChange>
          <ToastProvider>
            <AnchoredToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
