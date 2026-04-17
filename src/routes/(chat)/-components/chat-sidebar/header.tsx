import { Link } from '@tanstack/react-router'
import { PanelRightCloseIcon, PanelRightOpenIcon, SquarePenIcon } from 'lucide-react'

import { AppLogo } from '@/components/app-logo'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function Header() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarHeader className="p-2.5">
      <SidebarMenu className="gap-2">
        <SidebarMenuItem className="flex flex-row items-center py-0">
          <span
            className={cn(
              'transition-all flex-1 overflow-hidden whitespace-nowrap duration-200 ease-linear ',
              isCollapsed ? 'w-0 h-0 opacity-0' : 'w-auto pl-2 opacity-100',
            )}
          >
            <AppLogo />
          </span>
          <SidebarMenuButton
            tooltip="Toggle Sidebar"
            onClick={toggleSidebar}
            className={isCollapsed ? '' : 'ml-auto size-8'}
          >
            {state === 'expanded' ? <PanelRightOpenIcon /> : <PanelRightCloseIcon />}
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="New Chat" render={<Link to="/" />}>
            <SquarePenIcon />
            <span>New Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
