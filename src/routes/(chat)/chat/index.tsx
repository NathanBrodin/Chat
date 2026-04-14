import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(chat)/chat/')({
  loader: () => {
    throw redirect({
      to: '/',
    })
  },
})
