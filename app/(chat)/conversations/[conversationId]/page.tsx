import { Conversation } from "@/components/conversation"
import { Message } from "@/components/message"
import { getMessages } from "@/lib/db/actions"

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const conversationId = (await params).conversationId

  const messages = await getMessages(conversationId)

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">You are wayyy to curious</h2>
          <p className="text-muted-foreground">Stop looking at other people conversations ?!</p>
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-grow flex-col-reverse items-center overflow-auto px-2 py-2 pt-10 sm:my-4">
        <div className="pointer-events-none fixed inset-0 z-10 h-[120px] w-full bg-gradient-to-b from-background to-transparent" />
        <div className="w-full max-w-7xl space-y-2">
          {messages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
