import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { GhostIcon, PencilIcon, Settings2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { removeConversation, renameConversation } from '@/lib/chat/functions'
import {
  deleteLocalConversation,
  isLocalConversation,
  renameLocalConversation,
} from '@/lib/chat/local-storage'

interface ChatHeaderProps {
  title: string
  conversationId?: string
}

export function ChatHeader({ title, conversationId }: ChatHeaderProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [renameValue, setRenameValue] = useState(title)
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const doRename = useServerFn(renameConversation)
  const doRemove = useServerFn(removeConversation)

  const handleRename = async () => {
    if (!conversationId || !renameValue.trim()) return

    if (isLocalConversation(conversationId)) {
      renameLocalConversation(conversationId, renameValue.trim())
    } else {
      await doRename({ data: { conversationId, title: renameValue.trim() } })
    }
    setRenameOpen(false)
  }

  const handleDelete = async () => {
    if (!conversationId) return

    if (isLocalConversation(conversationId)) {
      deleteLocalConversation(conversationId)
    } else {
      await doRemove({ data: { conversationId } })
    }
    setDeleteOpen(false)
    void navigate({ to: '/chat' })
  }

  return (
    <>
      <header className="flex w-full shrink-0 items-center justify-between gap-2 p-2.5 px-4">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          <h1 className="truncate font-heading">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <GhostIcon />
          </Button>

          {conversationId && (
            <Menu>
              <MenuTrigger render={<Button variant="outline" size="icon" />}>
                <Settings2Icon />
              </MenuTrigger>
              <MenuPopup align="start" sideOffset={4}>
                <MenuGroup>
                  <MenuGroupLabel>Manage conversation</MenuGroupLabel>
                  <MenuItem
                    onSelect={() => {
                      setRenameValue(title)
                      setRenameOpen(true)
                    }}
                  >
                    <PencilIcon aria-hidden="true" />
                    Rename
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    variant="destructive"
                    onSelect={() => {
                      setDeleteOpen(true)
                    }}
                  >
                    <TrashIcon aria-hidden="true" />
                    Delete
                  </MenuItem>
                </MenuGroup>
              </MenuPopup>
            </Menu>
          )}
        </div>
      </header>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>Enter a new name for this conversation.</DialogDescription>
          </DialogHeader>
          <div className="px-6">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleRename()
              }}
              placeholder="Conversation title"
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={() => void handleRename()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={() => void handleDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
