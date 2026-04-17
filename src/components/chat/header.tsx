import { api } from '@convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { GhostIcon, PencilIcon, Settings2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { ConversationDownload } from '@/components/ai-elements/conversation'
import { useAppForm } from '@/components/form/use-form'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
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

const renameConversationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})

export function ChatHeader() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { conversationId, messages, title } = useChatContext()
  const deleteConversation = useMutation(api.chat.remove)
  const renameConversation = useMutation(api.chat.rename)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      title: title ?? '',
    },
    validators: {
      onSubmit: renameConversationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!conversationId) {
        return
      }

      renameConversation({
        title: value.title.trim(),
        conversationId: conversationId as any,
      })

      setIsEditDialogOpen(false)
    },
  })

  async function handleDelete() {
    if (!conversationId) {
      return
    }

    deleteConversation({ conversationId: conversationId as any })
    setIsDeleteDialogOpen(false)
    await navigate({ to: '/' })
  }

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 p-2.5 px-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="truncate font-heading">{title ?? 'Conversation'}</h1>
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
              {conversationId && (
                <>
                  <MenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <PencilIcon aria-hidden="true" />
                    Rename
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">
                    <TrashIcon aria-hidden="true" />
                    Delete
                  </MenuItem>
                </>
              )}
            </MenuGroup>
          </MenuPopup>
        </Menu>
        <Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Edit Title</DialogTitle>
              <DialogDescription>Change the title of this conversation</DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <Form
                onSubmit={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void form.handleSubmit()
                }}
              >
                <form.AppField name="title">
                  {(field) => (
                    <field.InputField label="Title" placeholder="Conversation title" type="text" />
                  )}
                </form.AppField>
                <DialogFooter variant="bare">
                  <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                  <form.AppForm>
                    <form.SubmitButton label="Save" submittingLabel="Saving" />
                  </form.AppForm>
                </DialogFooter>
              </Form>
            </DialogPanel>
          </DialogPopup>
        </Dialog>
        <AlertDialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes this conversation and its messages. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
              <Button type="button" variant="destructive" onClick={() => void handleDelete()}>
                Delete conversation
              </Button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
      </div>
    </header>
  )
}
