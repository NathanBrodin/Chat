import { useChat, type UIMessage } from '@ai-sdk/react'
import { createFileRoute } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
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
  PromptInputHeader,
} from '@/components/ai-elements/prompt-input'
import { ScrollArea } from '@/components/ui/scroll-area'

import { PromptInputAttachmentsDisplay } from './-components/attachments-display'
import { ChatHeader } from './-components/header'
import { ChatModels } from './-components/models'

export const Route = createFileRoute('/(app)/chat/')({
  component: Chat,
})

function Chat() {
  const [text, setText] = useState<string>('')
  const { status, messages, sendMessage } = useChat({})

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    if (!hasText) {
      return
    }
    void sendMessage({
      text: message.text,
    })
    setText('')
  }

  return (
    <>
      <ChatHeader />
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full py-4" scrollFade scrollbarGutter>
          {messages.map((message) => (
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
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger
                  tooltip={{
                    content: 'Attach files',
                  }}
                />
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
