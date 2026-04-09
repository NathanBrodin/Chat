import { createFileRoute } from '@tanstack/react-router'

import Example from '@/components/chatbot'

export const Route = createFileRoute('/(app)/chat/')({
  component: Chat,
})

function Chat() {
  return <Example />
}
