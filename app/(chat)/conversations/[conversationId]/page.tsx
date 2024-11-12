import { Message } from "@/components/message"
import { getMessages } from "@/lib/db/actions"

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const conversationId = (await params).conversationId

  const messages = await getMessages(conversationId)

  return (
    <div className="p-4">
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  )
}
