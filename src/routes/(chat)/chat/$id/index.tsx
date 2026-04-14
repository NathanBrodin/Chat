import { createFileRoute } from '@tanstack/react-router'

import { Chat } from '@/components/chat'

export const Route = createFileRoute('/(chat)/chat/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  // FUNCTIONS.ts ????????????????????????

  return <Chat id={id} />
}
