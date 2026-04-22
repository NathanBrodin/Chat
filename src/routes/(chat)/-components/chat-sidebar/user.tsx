import { useRateLimit } from '@convex-dev/rate-limiter/react'
import { api } from '@convex/_generated/api'
import { useTheme } from '@lonik/themer'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import {
  ChevronsUpDown,
  KeyboardIcon,
  LogOutIcon,
  PaintbrushIcon,
  SettingsIcon,
} from 'lucide-react'
import { useCallback, useState } from 'react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Dialog, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from '@/components/ui/menu'
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from '@/components/ui/progress'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { UserAvatar } from '@/components/user-avatar'
import { authClient } from '@/lib/auth/auth-client'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { SignInButton } from './sign-in'

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

function formatRetryAt(retryAt: number) {
  const remainingMs = Math.max(0, retryAt - Date.now())
  const seconds = Math.ceil(remainingMs / 1000)

  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.ceil(seconds / 60)
  return `${minutes}m`
}

export function SidebarUser() {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: user } = useSuspenseQuery(currentUserQueryOptions)

  const { resolvedTheme, setTheme } = useTheme()
  const usage = useQuery(api.usage.getCurrentUserUsage, user ? {} : 'skip')

  const { status: sendMessageRateLimitStatus } = useRateLimit(api.rateLimiting.getRateLimit, {
    name: 'sendMessage',
    getServerTimeMutation: api.rateLimiting.getServerTime,
  })

  const switchTheme = useCallback(() => {
    const theme = resolvedTheme === 'dark' ? 'light' : 'dark'

    if (!document.startViewTransition) {
      setTheme(theme)
      return
    }

    document.startViewTransition(() => setTheme(theme))
  }, [resolvedTheme, setTheme])

  useHotkey('T', switchTheme)

  if (!user) return <SignInButton />

  const usagePercent = usage ? Math.min(100, usage.percentUsed) : 0

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await navigate({ to: '/chat' })
        },
      },
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger render={<SidebarMenuButton tooltip="Settings and Account" size="lg" />}>
            <UserAvatar user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </MenuTrigger>
          <MenuPopup
            className="w-(--sidebar-width)  rounded-lg"
            side="top"
            align="start"
            sideOffset={4}
          >
            <MenuGroup>
              <MenuItem render={<Link to="/account" />}>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar user={user} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
                <MenuShortcut>
                  <SettingsIcon className="mr-1.5 size-4" />
                </MenuShortcut>
              </MenuItem>
              <MenuSeparator />
              <MenuItem className="cursor-default py-4">
                <Progress value={usagePercent}>
                  <div className="flex items-center justify-between gap-2">
                    <ProgressLabel>Usage Limits</ProgressLabel>
                    <span className="text-sm tabular-nums">{Math.round(usagePercent)}%</span>
                  </div>
                  <ProgressTrack>
                    <ProgressIndicator />
                  </ProgressTrack>
                  <p className="text-xs text-muted-foreground">
                    {usage
                      ? `${formatCompactNumber(usage.totalTokens)} / ${formatCompactNumber(usage.monthlyLimitTokens)} tokens this month`
                      : 'Loading usage...'}
                  </p>
                  {sendMessageRateLimitStatus && !sendMessageRateLimitStatus.ok && (
                    <p className="text-xs text-amber-600">
                      Cooldown active. Try again in{' '}
                      {formatRetryAt(sendMessageRateLimitStatus.retryAt)}.
                    </p>
                  )}
                </Progress>
              </MenuItem>
              <MenuSeparator />
              <MenuItem className="cursor-default">
                <PaintbrushIcon />
                Theme
                <MenuShortcut>
                  <ThemeToggle />
                </MenuShortcut>
              </MenuItem>
              <MenuItem onClick={() => setDialogOpen(true)}>
                <KeyboardIcon />
                Keyboard Shortcuts
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={signOut}>
                <LogOutIcon />
                Log Out
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
            </DialogHeader>
            <DialogPanel>
              <div className="flex gap-2">
                <p className="mb-2 text-sm text-muted-foreground">Toggle Theme:</p>
                <Kbd>T</Kbd>
              </div>
              <div className="flex gap-2">
                <p className="mb-2 text-sm text-muted-foreground">Toggle Sidebar:</p>
                <Kbd>S</Kbd>
              </div>
            </DialogPanel>
          </DialogPopup>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
