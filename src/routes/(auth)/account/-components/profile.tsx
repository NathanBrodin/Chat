import { useState } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/form/use-form'
import { Form } from '@/components/ui/form'
import { UserAvatar } from '@/components/user-avatar'
import { authClient } from '@/lib/auth/auth-client'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

export function ProfileSection({
  name,
  user,
}: {
  name: string
  user: Parameters<typeof UserAvatar>[0]['user']
}) {
  const [saved, setSaved] = useState(false)

  const form = useAppForm({
    defaultValues: { name },
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser({ name: value.name.trim() })
      if (error) {
        throw error
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    },
  })

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Profile</h3>
        <p className="text-sm text-muted-foreground">Update your personal information.</p>
      </div>
      <div className="flex items-center gap-3">
        <UserAvatar className="h-12 w-12" user={user} />
        <div className="grid text-sm leading-tight">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.InputField
              autoComplete="name"
              label="Display name"
              placeholder="Your name"
              type="text"
            />
          )}
        </form.AppField>
        <div className="flex items-center gap-3">
          <form.AppForm>
            <form.SubmitButton label="Save changes" submittingLabel="Saving" />
          </form.AppForm>
          {saved && <p className="text-sm text-success">Profile updated.</p>}
        </div>
      </Form>
    </section>
  )
}
