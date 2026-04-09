import { useTheme } from '@lonik/themer'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, KeyboardIcon, LogOutIcon, SettingsIcon } from 'lucide-react'
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
  MenuTrigger,
} from '@/components/ui/menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { UserAvatar } from '@/components/user-avatar'
import { authClient } from '@/lib/auth/auth-client'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { SignInButton } from './sign-in'

export function SidebarUser() {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: user } = useSuspenseQuery(currentUserQueryOptions)

  const { resolvedTheme, setTheme } = useTheme()

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  useHotkey('T', switchTheme)

  if (!user) return <SignInButton />

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
                <SettingsIcon className="size-4" />
              </MenuItem>
              <MenuSeparator />
              <MenuItem>
                Theme
                <ThemeToggle />
              </MenuItem>
              <MenuItem onClick={() => setDialogOpen(true)}>
                Keyboard Shortcuts
                <KeyboardIcon />
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={signOut}>
                Log Out
                <LogOutIcon />
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
