import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon, LinkIcon, UnlinkIcon } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/form/use-form'
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
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { GitHubIcon } from '@/components/ui/icons/github'
import { GoogleIcon } from '@/components/ui/icons/google'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { authClient } from '@/lib/auth/auth-client'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

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

const PROVIDERS = [
  { id: 'google', name: 'Google', icon: GoogleIcon },
  { id: 'github', name: 'GitHub', icon: GitHubIcon },
] as const

export const Route = createFileRoute('/(app)/(auth)/account/')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/sign-in', search: { redirect: '/account' } })
    }
  },
  component: RouteComponent,
})

function useInvalidateUser() {
  const queryClient = useQueryClient()
  const queryOptions = convexQuery(api.auth.index.getCurrentUser, {})

  return () => queryClient.invalidateQueries({ queryKey: queryOptions.queryKey })
}

function RouteComponent() {
  const { data: user } = useSuspenseQuery(convexQuery(api.auth.index.getCurrentUser, {}))
  const navigate = useNavigate()

  if (!user) return null

  return (
    <main className="flex min-h-screen w-full items-center justify-center sm:px-4 sm:py-8">
      <Card className="w-full max-sm:rounded-none max-sm:border-x-0 max-sm:shadow-none max-sm:before:rounded-none sm:max-w-xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your profile and account settings.</CardDescription>
          <CardAction>
            <Button render={<Link to="/chat" />} size="sm" variant="ghost">
              <ArrowLeftIcon />
              Back
            </Button>
          </CardAction>
        </CardHeader>
        <CardPanel className="flex flex-col gap-6">
          <ProfileSection name={user.name ?? ''} user={user} />
          <Separator />
          <ProvidersSection />
          <Separator />
          <PasswordSection />
          <Separator />
          <DeleteSection
            onDeleted={() => {
              void navigate({ to: '/sign-in' })
            }}
          />
        </CardPanel>
      </Card>
    </main>
  )
}

function ProfileSection({
  name,
  user,
}: {
  name: string
  user: Parameters<typeof UserAvatar>[0]['user']
}) {
  const invalidateUser = useInvalidateUser()
  const [saved, setSaved] = useState(false)

  const form = useAppForm({
    defaultValues: { name },
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser({ name: value.name.trim() })
      if (error) {
        throw error
      }
      await invalidateUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
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

function ProvidersSection() {
  const queryClient = useQueryClient()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const { data: accounts } = useQuery({
    queryKey: ['auth', 'listAccounts'],
    queryFn: async () => {
      const { data } = await authClient.listAccounts()
      return data ?? []
    },
  })

  const linkedProviderIds = new Set(
    accounts
      ?.filter((account: { providerId: string }) => account.providerId !== 'credential')
      .map((account: { providerId: string }) => account.providerId),
  )

  async function handleLink(providerId: string) {
    setLoadingProvider(providerId)
    try {
      await authClient.linkSocial({
        provider: providerId as 'google' | 'github',
        callbackURL: '/account',
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  async function handleUnlink(providerId: string) {
    setLoadingProvider(providerId)
    try {
      const { error } = await authClient.unlinkAccount({ providerId })
      if (error) {
        throw error
      }
      await queryClient.invalidateQueries({ queryKey: ['auth', 'listAccounts'] })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Connected accounts</h3>
        <p className="text-sm text-muted-foreground">
          Link third-party accounts for faster sign-in.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviderIds.has(provider.id)
          return (
            <div
              key={provider.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <provider.icon className="size-5" />
                <span className="text-sm font-medium">{provider.name}</span>
              </div>
              {isLinked ? (
                <Button
                  loading={loadingProvider === provider.id}
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => void handleUnlink(provider.id)}
                >
                  <UnlinkIcon />
                  Disconnect
                </Button>
              ) : (
                <Button
                  loading={loadingProvider === provider.id}
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => void handleLink(provider.id)}
                >
                  <LinkIcon />
                  Connect
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PasswordSection() {
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
      setTimeout(() => setSaved(false), 2000)
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
        <form.AppField name="currentPassword">
          {(field) => (
            <field.InputField
              autoComplete="current-password"
              label="Current password"
              placeholder="Enter current password"
              type="password"
            />
          )}
        </form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.InputField
              autoComplete="new-password"
              label="New password"
              placeholder="Enter new password"
              type="password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.InputField
              autoComplete="new-password"
              label="Confirm new password"
              placeholder="Confirm new password"
              type="password"
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

function DeleteSection({ onDeleted }: { onDeleted: () => void }) {
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
