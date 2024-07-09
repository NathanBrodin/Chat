import { ChatMessage } from "@/lib/types";
import { Message } from "./message";

type ConversationProps = {
  messages: ChatMessage[];
};

export default function Conversation({ messages }: ConversationProps) {
  return (
    <div className="flex h-full w-full max-w-7xl flex-col justify-end gap-4 overflow-y-scroll px-8 py-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
