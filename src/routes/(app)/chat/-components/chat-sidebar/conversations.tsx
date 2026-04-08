import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

export function Conversations() {
  const items = [
    {
      title: 'Something that nanani nanana',
    },
    {
      title: 'Something that nanani nanana',
    },
    {
      title: 'Something that nanani nanana',
    },
    {
      title: 'Something that nanani nanana',
    },
    {
      title: 'Something that nanani nanana',
    },
  ]
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((chat, index) => (
          <SidebarMenuButton key={index}>{chat.title}</SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
