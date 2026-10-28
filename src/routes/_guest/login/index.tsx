import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { LoaderCircleIcon } from "lucide-react"

import { SocialSignInButtons } from "@/components/sign-in-social-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toastManager } from "@/components/ui/toast"
import { authClient } from "@/lib/auth/auth-client"
import { buildNoindexHead } from "@/lib/seo"

export const Route = createFileRoute("/_guest/login/")({
  component: LoginForm,
  head: () => ({
    ...buildNoindexHead({ title: "Log in | Nathan's AI", follow: true }),
    links: [],
    scripts: [],
  }),
})

function LoginForm() {
  const { redirectUrl } = Route.useRouteContext()

  const { mutate: emailLoginMutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email(
        {
          ...data,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toastManager.add({
              type: "error",
              description: error.message || "An error occurred while signing in.",
            })
          },
          // better-auth seems to trigger a hard navigation on login,
          // so we don't have to revalidate & navigate ourselves
          // onSuccess: () => {
          //   queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
          //   navigate({ to: redirectUrl });
          // },
        },
      ),
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending) return

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) return

    emailLoginMutate({ email, password })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Enter your details to access your account.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={isPending}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                autoComplete="email"
                readOnly={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                readOnly={isPending}
                required
              />
            </div>
            <Button type="submit" className="mt-2 w-full" size="lg" disabled={isPending}>
              {isPending && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          </div>
          <SocialSignInButtons callbackURL={redirectUrl} disabled={isPending} />
        </div>
      </form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  )
}
