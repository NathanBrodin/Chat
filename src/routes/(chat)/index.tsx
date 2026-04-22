import { api } from '@convex/_generated/api'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/(chat)/')({
  head: () => ({
    links: [{ rel: 'canonical', href: siteConfig.url }],
  }),
  component: RouteComponent,
})

export function RouteComponent() {
  const createThread = useMutation(api.thread.createNewThread)
  const navigate = useNavigate()

  function handleStartConversation() {
    createThread({
      title: 'New conversation',
    }).then((newId) => {
      navigate({ to: '/chat/$id', params: { id: newId } })
    })
  }

  return (
    <div className="h-full w-full flex-1 items-center justify-center">
      <Button onClick={handleStartConversation}>Start a new conversation</Button>
    </div>
  )
}
