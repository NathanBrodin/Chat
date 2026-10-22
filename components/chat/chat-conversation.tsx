"use client";

import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ScrollAreaPrimitive,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { ChatJumpToLatestButton } from "./chat-jump-to-latest-button";
import type { ChatScrollController } from "./hooks/use-chat-scroll";

export type ChatConversationProps = ComponentProps<"div"> & {
  scroll: ChatScrollController;
  label: string;
  jumpLabel: ReactNode;
  contentClassName?: string;
  overlay?: ReactNode;
  inactive?: boolean;
  /** "off" when the caller announces arrivals itself, e.g. so paged-in history isn't read out. */
  live?: "polite" | "off";
};

export function ChatConversation({
  scroll,
  label,
  jumpLabel,
  contentClassName,
  children,
  overlay,
  inactive = false,
  live,
  className,
  ...props
}: ChatConversationProps): ReactElement {
  return (
    <div
      data-slot="chat-conversation"
      className={cn("relative isolate flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Root
        inert={inactive}
        className="size-full min-h-0 touch-auto"
      >
        <ScrollAreaPrimitive.Viewport
          ref={scroll.viewportRef}
          role="log"
          aria-label={label}
          aria-live={live}
          aria-relevant="additions text"
          data-slot="scroll-area-viewport"
          className="h-full rounded-[inherit] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]"
          onScroll={scroll.onScroll}
        >
          <ScrollAreaPrimitive.Content
            data-slot="scroll-area-content"
            className={cn("px-4 pb-4", contentClassName)}
            style={{ minWidth: 0 }}
          >
            {children}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      </ScrollAreaPrimitive.Root>
      {scroll.showJump && !inactive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center">
          <ChatJumpToLatestButton onClick={scroll.scrollToLatest}>
            {jumpLabel}
          </ChatJumpToLatestButton>
        </div>
      )}
      {overlay}
    </div>
  );
}
