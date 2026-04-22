import { createFileRoute } from '@tanstack/react-router'

import { Chat } from '@/components/chat'

export const Route = createFileRoute('/(chat)/chat/$id/')({
  component: RouteComponent,
})

export function RouteComponent() {
  const { id } = Route.useParams()

  return <Chat threadId={id} />
}
