import { useState } from 'react'

import {
  PromptInput,
  PromptInputBody,
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
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { PromptInputAttachmentsDisplay } from '@/routes/(app)/chat/-components/attachments-display'

import { useChatContext } from '.'
import { ChatModels } from './models'

export function ChatInput() {
  const { sendMessage, status } = useChatContext()
  const [text, setText] = useState<string>('')

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    if (!hasText) {
      return
    }
    void sendMessage({ text: message.text })
    setText('')
  }

  return (
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
  )
}
