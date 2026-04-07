import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'

import { authClient } from '@/lib/auth/auth-client'

import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data } = useSuspenseQuery(convexQuery(api.todos.list, {}))
  const { mutate, isPending } = useMutation({ mutationFn: useConvexMutation(api.todos.add) })

  return (
    <div className="flex flex-col gap-2">
      Hello, world
      <ul>
        {data.map((todo) => (
          <li key={todo._id}>{todo.text}</li>
        ))}
      </ul>
      <button
        className="w-fit cursor-pointer rounded-xl bg-slate-700 px-3 py-2"
        onClick={() => mutate({ text: 'Hello' })}
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Create new'}
      </button>
      <Unauthenticated>Logged out</Unauthenticated>
      <Authenticated>Logged in</Authenticated>
      <AuthLoading>Loading...</AuthLoading>
      <button
        onClick={async () => {
          await authClient.signUp.email({
            name: 'nathan',
            email: 'nathan@brodin.dev',
            password: 'something',
          })
        }}
      >
        Sign in with Email
      </button>
    </div>
  )
}
