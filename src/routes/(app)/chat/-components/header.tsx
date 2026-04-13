import type { UIMessage } from 'ai'

import { GhostIcon, PencilIcon, Settings2Icon, TrashIcon } from 'lucide-react'

import { ConversationDownload } from '@/components/ai-elements/conversation'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export function ChatHeader({ messages }: { messages: UIMessage[] }) {
  const { isMobile } = useSidebar()

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 p-2.5 px-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="font-heading">Conversation title</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <GhostIcon />
        </Button>
        <Menu>
          <MenuTrigger render={<Button variant="outline" size="icon" />}>
            <Settings2Icon />
          </MenuTrigger>
          <MenuPopup align="start" sideOffset={4}>
            <ConversationDownload messages={messages} />
            <MenuSeparator />

            <MenuGroup>
              <MenuGroupLabel>Manage conversation</MenuGroupLabel>
              <MenuItem>
                <PencilIcon aria-hidden="true" />
                Rename
              </MenuItem>
              <MenuItem variant="destructive">
                <TrashIcon aria-hidden="true" />
                Delete
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </div>
    </header>
  )
}
