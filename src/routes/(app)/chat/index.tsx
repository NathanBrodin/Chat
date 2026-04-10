import { useChat } from '@ai-sdk/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
} from '@/components/ai-elements/prompt-input'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ChatHeader } from './-components/header'
import { ChatModels } from './-components/models'

export const Route = createFileRoute('/(app)/chat/')({
  component: Chat,
})

const TEST_MESSAGES = Array.from({ length: 150 }, (_, i) => ({
  id: `msg-${i}`,
  role: i % 2 === 0 ? 'user' : 'assistant',
  parts: [
    {
      type: 'text',
      text: `${i % 2 === 0 ? 'User' : 'AI'} message ${i + 1}: Lorem ipsum dolor sit amet.`,
    },
  ],
}))

function Chat() {
  const [text, setText] = useState<string>('')
  const { status, sendMessage } = useChat()
  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    if (!hasText) {
      return
    }
    sendMessage({
      text: message.text,
    })
    setText('')
  }

  return (
    <>
      <ChatHeader />
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full py-4" scrollFade scrollbarGutter>
          {TEST_MESSAGES.map((message) => (
            <div key={message.id} className="mx-auto max-w-7xl px-4 whitespace-pre-wrap ">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>
                }
              })}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="mx-auto w-full max-w-7xl shrink-0 p-2.5 px-4">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputBody>
            <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <ChatModels />
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  )
}
