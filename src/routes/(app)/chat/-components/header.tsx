import { GhostIcon, Settings2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export function ChatHeader() {
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
        <Button variant="outline" size="icon">
          <Settings2Icon />
        </Button>
      </div>
    </header>
  )
}
