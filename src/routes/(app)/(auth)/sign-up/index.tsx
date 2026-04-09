import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '@/components/form/use-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldSeparator } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { GitHubIcon } from '@/components/ui/icons/github'
import { GoogleIcon } from '@/components/ui/icons/google'
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

  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: redirectTo,
    })
  }

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: redirectTo,
    })
  }

  const lastMethod = authClient.getLastUsedLoginMethod()

  return (
    <main className="flex min-h-screen w-full items-center justify-center sm:px-4 sm:py-8">
      <Card className="w-full max-sm:rounded-none max-sm:border-x-0 max-sm:shadow-none max-sm:before:rounded-none sm:max-w-xl">
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
            <form.AppField name="email">{(field) => <field.EmailField />}</form.AppField>
            <form.AppField name="password">
              {(field) => <field.PasswordField newPassword />}
            </form.AppField>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>
            <Field className="grid sm:grid-cols-2">
              <Button
                variant="outline"
                type="button"
                onClick={signInWithGithub}
                className="relative"
              >
                <GitHubIcon />
                Login with Github
                {lastMethod === 'github' && (
                  <Badge className="absolute -top-1 -right-1" size="sm" variant="info">
                    Last used
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={signInWithGoogle}
                className="relative"
              >
                <GoogleIcon />
                Login with Google
                {lastMethod === 'google' && (
                  <Badge className="absolute -top-1 -right-1" size="sm" variant="info">
                    Last used
                  </Badge>
                )}
              </Button>
            </Field>
            <form.AppForm>
              <form.SubmitButton label="Create account" submittingLabel="Creating account" />
            </form.AppForm>
          </Form>
        </CardPanel>
      </Card>
    </main>
  )
}
