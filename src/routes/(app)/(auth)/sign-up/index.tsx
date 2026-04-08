import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '@/components/form/use-form'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'
import { getSafeAuthRedirect } from '@/lib/auth/get-safe-auth-redirect'

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

const signUpSchema = z.object({
  email: z.email('Enter a valid email address'),
  name: z.string().trim().min(1, 'Enter your name'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const Route = createFileRoute('/(app)/(auth)/sign-up/')({
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect ?? '/' })
    }
  },
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const search = Route.useSearch()
  const redirectTo = getSafeAuthRedirect(search.redirect)

  const form = useAppForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        callbackURL: redirectTo,
        email: value.email,
        name: value.name.trim(),
        password: value.password,
      })

      console.log(error)
    },
    validators: {
      onSubmit: signUpSchema,
    },
  })

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start fresh with your own workspace.</CardDescription>
          <CardAction>
            <Link
              className="text-sm leading-4.5 text-muted-foreground hover:underline"
              search={{ redirect: redirectTo }}
              to="/sign-in"
            >
              Sign in
            </Link>
          </CardAction>
        </CardHeader>
        <CardPanel>
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
                  label="Name"
                  placeholder="John Doe"
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <field.InputField
                  autoComplete="email"
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.InputField
                  autoComplete="new-password"
                  label="Password"
                  placeholder="Create a password"
                  type="password"
                />
              )}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton label="Create account" submittingLabel="Creating account" />
            </form.AppForm>
          </Form>
        </CardPanel>
      </Card>
    </main>
  )
}
