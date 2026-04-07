import { SidebarHeader, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar'

export function Header() {
  return (
    <SidebarHeader>
      <SidebarMenuItem>
        <SidebarTrigger />
      </SidebarMenuItem>
    </SidebarHeader>
  )
}
