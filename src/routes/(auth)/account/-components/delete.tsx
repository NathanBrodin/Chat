import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/auth-client'

export function DeleteSection({ onDeleted }: { onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const queryClient = useQueryClient()

  async function handleDelete() {
    setDeleting(true)
    try {
      const { error } = await authClient.deleteUser({
        callbackURL: '/sign-in',
      })
      if (error) {
        throw error
      }
      queryClient.clear()
      onDeleted()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-destructive-foreground">Delete account</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
          Delete account
        </AlertDialogTrigger>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all of your data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
            <Button
              loading={deleting}
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
            >
              Delete account
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </section>
  )
}
