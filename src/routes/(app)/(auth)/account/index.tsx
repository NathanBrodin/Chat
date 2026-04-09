import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { AppLogo } from '@/components/app-logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { DeleteSection } from './-components/delete'
import { PasswordSection } from './-components/password'
import { ProfileSection } from './-components/profile'
import { ProvidersSection } from './-components/providers'

export const Route = createFileRoute('/(app)/(auth)/account/')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/sign-in', search: { redirect: '/account' } })
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(currentUserQueryOptions),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useSuspenseQuery(currentUserQueryOptions)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <main className="flex min-h-screen w-full items-center justify-center sm:px-4 sm:py-8">
      <CardFrame className="w-full max-sm:rounded-none max-sm:border-x-0 max-sm:shadow-none max-sm:before:rounded-none sm:max-w-xl">
        <CardFrameHeader>
          <CardFrameTitle>Account</CardFrameTitle>
          <CardFrameDescription>Manage your profile and account settings.</CardFrameDescription>
          <CardFrameAction>
            <Button render={<Link to="/chat" />} size="sm" variant="ghost">
              <ArrowLeftIcon />
              Back
            </Button>
          </CardFrameAction>
        </CardFrameHeader>
        <Card>
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
        <CardFrameFooter>
          <AppLogo />
        </CardFrameFooter>
      </CardFrame>
    </main>
  )
}
