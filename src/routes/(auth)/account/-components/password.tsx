import { useState } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/form/use-form'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function PasswordSection() {
  const [saved, setSaved] = useState(false)

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: { onSubmit: passwordSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        throw error
      }
      form.reset()
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    },
  })

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password. This will sign out all other sessions.
        </p>
      </div>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.AppField name="currentPassword">{(field) => <field.PasswordField />}</form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.PasswordField
              newPassword
              label="New password"
              placeholder="Enter new password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              newPassword
              label="Confirm new password"
              placeholder="Confirm new password"
            />
          )}
        </form.AppField>
        <div className="flex items-center gap-3">
          <form.AppForm>
            <form.SubmitButton label="Update password" submittingLabel="Updating" />
          </form.AppForm>
          {saved && <p className="text-sm text-success">Password updated.</p>}
        </div>
      </Form>
    </section>
  )
}
