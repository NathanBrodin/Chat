'use client'

import type { UIMessage } from 'ai'
import type { ComponentProps } from 'react'

import { ArrowDownIcon, DownloadIcon } from 'lucide-react'
import { createContext, use, useCallback } from 'react'
import { useStickToBottom } from 'use-stick-to-bottom'

import { Button } from '@/components/ui/button'
import { ScrollAreaPrimitive, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { MenuItem } from '../ui/menu'

type ConversationContextValue = Pick<
  ReturnType<typeof useStickToBottom>,
  'isAtBottom' | 'scrollToBottom'
>

const ConversationContext = createContext<ConversationContextValue | null>(null)

type ConversationRootProps = Omit<ComponentProps<typeof ScrollAreaPrimitive.Root>, 'children'>

export type ConversationProps = ConversationRootProps & {
  children: React.ReactNode
  scrollFade?: boolean
  scrollbarGutter?: boolean
}

export const Conversation = ({
  children,
  className,
  scrollFade = true,
  scrollbarGutter = true,
  role = 'log',
  ...props
}: ConversationProps) => {
  const { contentRef, isAtBottom, scrollRef, scrollToBottom } = useStickToBottom({
    initial: 'smooth',
    resize: 'smooth',
  })

  return (
    <ConversationContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <ScrollAreaPrimitive.Root
        className={cn('relative h-full min-h-0', className)}
        role={role}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={scrollRef}
          className={cn(
            'h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain',
            scrollFade &&
              'mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:3.5rem]',
            scrollbarGutter && 'data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5',
          )}
        >
          <div ref={contentRef}>{children}</div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      </ScrollAreaPrimitive.Root>
    </ConversationContext.Provider>
  )
}

export type ConversationContentProps = ComponentProps<'div'>

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => (
  <div className={cn('flex flex-col gap-8 p-4 mx-auto max-w-7xl', className)} {...props} />
)

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export const ConversationEmptyState = ({
  className,
  title = 'No messages yet',
  description = 'Start a conversation to see messages here',
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      'flex size-full flex-col items-center justify-center gap-3 p-8 text-center',
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </>
    )}
  </div>
)

export type ConversationScrollButtonProps = ComponentProps<typeof Button>

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const context = use(ConversationContext)

  if (!context) {
    throw new Error('ConversationScrollButton must be used within Conversation')
  }

  const { isAtBottom, scrollToBottom } = context

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return (
    !isAtBottom && (
      <Button
        className={cn(
          'absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-background dark:hover:bg-muted',
          className,
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  )
}

const getMessageText = (message: UIMessage): string =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')

export type ConversationDownloadProps = Omit<ComponentProps<typeof MenuItem>, 'onClick'> & {
  messages: UIMessage[]
  filename?: string
  formatMessage?: (message: UIMessage, index: number) => string
}

const defaultFormatMessage = (message: UIMessage): string => {
  const roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  return `**${roleLabel}:** ${getMessageText(message)}`
}

export const messagesToMarkdown = (
  messages: UIMessage[],
  formatMessage: (message: UIMessage, index: number) => string = defaultFormatMessage,
): string => messages.map((msg, i) => formatMessage(msg, i)).join('\n\n')

export const ConversationDownload = ({
  messages,
  filename = 'conversation.md',
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}: ConversationDownloadProps) => {
  const handleDownload = useCallback(() => {
    const markdown = messagesToMarkdown(messages, formatMessage)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [messages, filename, formatMessage])

  return (
    <MenuItem className={cn(className)} onClick={handleDownload} {...props}>
      <DownloadIcon />
      Download conversation
    </MenuItem>
  )
}
