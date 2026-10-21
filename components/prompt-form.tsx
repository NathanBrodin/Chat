"use client"

import * as React from "react"
import { ArrowUpIcon, SquareIcon } from "lucide-react"

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

export function PromptForm({
  isBusy,
  onSubmit,
  onStop,
}: {
  isBusy: boolean
  onSubmit: (text: string) => void
  onStop: () => void
}) {
  const [value, setValue] = React.useState<ComposerValue>([])

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
      <ComposerInput
        render={
          <textarea aria-label="Ask anything" placeholder="Ask anything..." />
        }
      />
      <ComposerActions>
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
