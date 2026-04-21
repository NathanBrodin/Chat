import { memo } from 'react'

import type { ChatMessage } from '@/lib/chat/types'

import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
  type AttachmentProps,
} from '@/components/ai-elements/attachments'
import { usePromptInputAttachments } from '@/components/ai-elements/prompt-input'
import { cn } from '@/lib/utils'

const AttachmentItem = memo(({ data, onRemove }: AttachmentProps) => {
  const mediaCategory = getMediaCategory(data)
  const label = getAttachmentLabel(data)

  return (
    <AttachmentHoverCard key={data.id}>
      <AttachmentHoverCardTrigger asChild>
        <Attachment data={data} onRemove={onRemove}>
          <div className="relative size-5 shrink-0">
            <div
              className={cn(
                'absolute inset-0 transition-opacity ',
                onRemove && 'group-hover:opacity-0',
              )}
            >
              <AttachmentPreview />
            </div>
            <AttachmentRemove className="absolute inset-0 -top-1" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>
      <AttachmentHoverCardContent>
        <div className="space-y-3">
          {mediaCategory === 'image' && data.type === 'file' && data.url && (
            <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
              <img
                alt={label}
                className="max-h-full max-w-full object-contain"
                height={384}
                src={data.url}
                width={320}
              />
            </div>
          )}
          <div className="space-y-1 px-0.5">
            <h4 className="text-sm leading-none font-semibold">{label}</h4>
            {data.mediaType && (
              <p className="font-mono text-xs text-muted-foreground">{data.mediaType}</p>
            )}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  )
})

export function PromptInputAttachmentsDisplay() {
  const attachments = usePromptInputAttachments()
  if (attachments.files.length === 0) {
    return null
  }

  return (
    <Attachments variant="inline" className="p-2 pb-0">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        />
      ))}
    </Attachments>
  )
}

export function MessageAttachmentsDisplay({ message }: { message: ChatMessage }) {
  const fileParts = message.parts
    .filter((part) => part.type === 'file')
    .map((part, index) => ({
      ...part,
      id: `${message.id}-file-${index}`,
    }))

  return (
    <>
      {fileParts.length > 0 && (
        <Attachments variant="inline" className="ml-auto justify-end ">
          {fileParts.map((part) => {
            return <AttachmentItem data={part} key={part.id} />
          })}
        </Attachments>
      )}
    </>
  )
}
