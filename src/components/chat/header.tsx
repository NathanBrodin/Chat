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

import { useChatContext } from '.'

export function ChatHeader() {
  const { isMobile } = useSidebar()
  const { id, messages } = useChatContext()

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 p-2.5 px-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="truncate font-heading">Conversation Title</h1>
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
            <MenuGroup>
              <MenuGroupLabel>Manage conversation</MenuGroupLabel>
              <ConversationDownload messages={messages} />
              {id && (
                <>
                  <MenuItem>
                    <PencilIcon aria-hidden="true" />
                    Rename
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem variant="destructive">
                    <TrashIcon aria-hidden="true" />
                    Delete
                  </MenuItem>
                </>
              )}
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </div>
    </header>
  )
}
