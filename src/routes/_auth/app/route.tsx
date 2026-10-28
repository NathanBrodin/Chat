import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

import { AppLogo } from "@/components/app-logo"

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
})

function AppLayout() {
  return (
    <main
      id="main-content"
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6"
    >
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link to="/" aria-label="Nathan's AI home" className="w-fit">
          <AppLogo />
        </Link>
        <div className="rounded-xl border bg-card p-6 text-card-foreground">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
