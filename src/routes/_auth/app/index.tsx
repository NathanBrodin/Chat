import { createFileRoute, Link } from "@tanstack/react-router"

import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { useAuthSuspense } from "@/lib/auth/hooks"

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
})

function AppIndex() {
  const { user } = useAuthSuspense()
  const displayName = user?.name || user?.email || "your account"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Your account</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{displayName}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg" render={<Link to="/conversations" />}>
          View conversations
        </Button>
        <SignOutButton />
      </div>
    </div>
  )
}
