import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/(chat)/')({
  head: () => ({
    links: [{ rel: 'canonical', href: siteConfig.url }],
  }),
  component: undefined,
})
