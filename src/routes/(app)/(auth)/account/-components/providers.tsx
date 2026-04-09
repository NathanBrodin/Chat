import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LinkIcon, UnlinkIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/ui/icons/github'
import { GoogleIcon } from '@/components/ui/icons/google'
import { authClient } from '@/lib/auth/auth-client'

const PROVIDERS = [
  { id: 'google', name: 'Google', icon: GoogleIcon },
  { id: 'github', name: 'GitHub', icon: GitHubIcon },
] as const

export function ProvidersSection() {
  const queryClient = useQueryClient()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const { data: accounts } = useQuery({
    queryKey: ['auth', 'listAccounts'],
    queryFn: async () => {
      const { data } = await authClient.listAccounts()
      return data ?? []
    },
  })

  const linkedProviderIds = new Set(
    accounts
      ?.filter((account: { providerId: string }) => account.providerId !== 'credential')
      .map((account: { providerId: string }) => account.providerId),
  )

  async function handleLink(providerId: string) {
    setLoadingProvider(providerId)
    try {
      await authClient.linkSocial({
        provider: providerId as 'google' | 'github',
        callbackURL: '/account',
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  async function handleUnlink(providerId: string) {
    setLoadingProvider(providerId)
    try {
      const { error } = await authClient.unlinkAccount({ providerId })
      if (error) {
        throw error
      }
      await queryClient.invalidateQueries({ queryKey: ['auth', 'listAccounts'] })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Connected accounts</h3>
        <p className="text-sm text-muted-foreground">
          Link third-party accounts for faster sign-in.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviderIds.has(provider.id)
          return (
            <div
              key={provider.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <provider.icon className="size-5" />
                <span className="text-sm font-medium">{provider.name}</span>
              </div>
              {isLinked ? (
                <Button
                  loading={loadingProvider === provider.id}
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => void handleUnlink(provider.id)}
                >
                  <UnlinkIcon />
                  Disconnect
                </Button>
              ) : (
                <Button
                  loading={loadingProvider === provider.id}
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => void handleLink(provider.id)}
                >
                  <LinkIcon />
                  Connect
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
