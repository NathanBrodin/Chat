"use client"

import { Button } from "@/components/ui/button"
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from "@/components/ui/composer"
import { Persona } from "@/components/chat/persona"
import { type ChatResponseState } from "@/components/chat/hooks/use-chat-response-state"
import { ArrowUpIcon, SquareIcon } from "lucide-react"
import { useState } from "react"

export function PromptForm({
  isBusy,
  responseState,
  onSubmit,
  onStop,
}: {
  isBusy: boolean
  responseState: ChatResponseState
  onSubmit: (text: string) => void
  onStop: () => void
}) {
  const [value, setValue] = useState<ComposerValue>([])

  function handleSubmit(draft: ComposerValue) {
    const text = getComposerText(draft).trim()
    if (!text || isBusy) return
    onSubmit(text)
    setValue([])
  }

  return (
    <Composer
      layout="adaptive"
      value={value}
      onValueChange={setValue}
      onSubmit={handleSubmit}
      submitOnEnter="desktop"
      submitDisabled={isBusy}
    >
      <ComposerInput aria-label="Ask anything" placeholder="Ask anything..." />
      <ComposerActions>
        <ComposerActionGroup>
          <Persona state={responseState} className="size-7" variant="glint" />
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          {isBusy ? (
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Stop generating"
              onClick={onStop}
            >
              <SquareIcon aria-hidden="true" />
            </Button>
          ) : (
            <ComposerSubmit
              render={
                <Button
                  size="icon-sm"
                  variant="default"
                  aria-label="Send message"
                />
              }
            >
              <ArrowUpIcon aria-hidden="true" />
            </ComposerSubmit>
          )}
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  )
}
