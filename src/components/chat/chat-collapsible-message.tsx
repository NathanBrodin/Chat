import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type { ReactElement, ReactNode } from "react"
import { useState } from "react"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

import { splitChatMessagePreview } from "./lib/split-chat-message-preview"

export type ChatCollapsibleMessageProps = {
  text: string
  showMoreLabel: string
  showLessLabel: string
  side: "incoming" | "outgoing"
  maxPreviewLength?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  renderText?: (text: string) => ReactNode
  className?: string
}

function renderPlainText(text: string): ReactElement {
  return <p className="m-0 text-sm leading-[1.55] break-words whitespace-pre-wrap">{text}</p>
}

function ChatCollapsibleMessage({
  text,
  showMoreLabel,
  showLessLabel,
  side,
  maxPreviewLength,
  defaultOpen = false,
  open,
  onOpenChange,
  renderText = renderPlainText,
  className,
}: ChatCollapsibleMessageProps): ReactElement {
  const { preview, remainder } = splitChatMessagePreview(text, maxPreviewLength)
  if (!remainder) {
    return <div className={cn("min-w-0", className)}>{renderText(text)}</div>
  }

  return (
    <ExpandableChatMessage
      text={text}
      preview={preview}
      renderText={renderText}
      showMoreLabel={showMoreLabel}
      showLessLabel={showLessLabel}
      side={side}
      className={className}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

function ExpandableChatMessage({
  text,
  preview,
  renderText,
  showMoreLabel,
  showLessLabel,
  side,
  className,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
}: {
  text: string
  preview: string
  renderText: (text: string) => ReactNode
  showMoreLabel: string
  showLessLabel: string
  side: "incoming" | "outgoing"
  className?: string
  defaultOpen: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}): ReactElement {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = (nextOpen: boolean): void => {
    if (controlledOpen === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }
  const Icon = open ? ChevronUpIcon : ChevronDownIcon

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("flex min-w-0 flex-col", className)}
    >
      <div className="grid">
        <div
          data-slot="chat-collapsible-preview"
          aria-hidden={open || undefined}
          className={cn(
            "col-start-1 row-start-1 self-start mask-[linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]",
            open && "invisible",
          )}
        >
          {renderText(preview)}
        </div>
        <CollapsiblePanel className="col-start-1 row-start-1 min-w-0 motion-reduce:transition-none">
          <div aria-hidden={!open || undefined} className={open ? undefined : "invisible"}>
            {renderText(text)}
          </div>
        </CollapsiblePanel>
      </div>
      <CollapsibleTrigger
        type="button"
        className={cn(
          "mt-2 flex w-fit items-center gap-1 text-start text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          side === "outgoing"
            ? "text-foreground/80 hover:text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {open ? showLessLabel : showMoreLabel}
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      </CollapsibleTrigger>
    </Collapsible>
  )
}

export { ChatCollapsibleMessage, splitChatMessagePreview }
