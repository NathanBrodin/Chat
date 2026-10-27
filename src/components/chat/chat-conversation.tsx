import type { ComponentProps, ReactElement, ReactNode } from "react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

export type ChatConversationProps = ComponentProps<"div"> & {
  label: string
  contentClassName?: string
  overlay?: ReactNode
  inactive?: boolean
  /** Announce arrivals on the transcript live region. */
  live?: "polite" | "off"
  /** True while a response streams, so announcements wait for the completed message. */
  busy?: boolean
  /** Matches the content's top padding so anchored turns settle below the fade. */
  scrollMargin?: number
}

export function ChatConversation({
  label,
  contentClassName,
  children,
  overlay,
  inactive = false,
  live,
  busy = false,
  scrollMargin = 24,
  className,
  ...props
}: ChatConversationProps): ReactElement {
  return (
    <div
      data-slot="chat-conversation"
      className={cn("relative isolate flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <MessageScrollerProvider
        autoScroll
        defaultScrollPosition="last-anchor"
        scrollMargin={scrollMargin}
      >
        <MessageScroller inert={inactive} className="min-h-0 flex-1">
          <MessageScrollerViewport aria-label={label} className="touch-auto">
            <MessageScrollerContent
              aria-live={live}
              aria-busy={busy}
              className={cn("px-4 pb-4", contentClassName)}
            >
              {children}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          {!inactive && <MessageScrollerButton />}
        </MessageScroller>
      </MessageScrollerProvider>
      {overlay}
    </div>
  )
}
