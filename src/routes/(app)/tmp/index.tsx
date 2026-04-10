import { createFileRoute } from '@tanstack/react-router'

import Example from '@/components/chatbot'

export const Route = createFileRoute('/(app)/tmp/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Example />
}
