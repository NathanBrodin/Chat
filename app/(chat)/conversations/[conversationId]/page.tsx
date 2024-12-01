import { Content } from "@/components/content"
import { Message } from "@/components/message"
import { getMessages } from "@/lib/db/actions"

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const conversationId = (await params).conversationId

  const messages = await getMessages(conversationId)

  return (
    <div className="p-4">
      {messages.map((message) => (
        <Message message={{ ...message, display: <Content content={message.display} /> }} key={message.id} />
      ))}
      {messages.length === 0 && (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="font-display text-3xl">No messages</div>
            <div>in this conversation</div>
          </div>
        </div>
      )}
    </div>
  )
}
