import type { ComponentProps } from 'react'

import { FileTextIcon, WrenchIcon } from 'lucide-react'

import type { Model, PublicPricing } from '@/lib/models/types'

import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

import { Badge } from '../ui/badge'

// ── Dialog-level components ──────────────────────────────────────────

export type ModelSelectorProps = ComponentProps<typeof CommandDialog>

export const ModelSelector = (props: ModelSelectorProps) => <CommandDialog {...props} />

export type ModelSelectorTriggerProps = ComponentProps<typeof CommandDialogTrigger>

export const ModelSelectorTrigger = (props: ModelSelectorTriggerProps) => (
  <CommandDialogTrigger {...props} />
)

export type ModelSelectorPopupProps = ComponentProps<typeof CommandDialogPopup>

export const ModelSelectorPopup = ({ className, ...props }: ModelSelectorPopupProps) => (
  <CommandDialogPopup className={cn('max-w-lg', className)} {...props} />
)

// ── Command-level components ─────────────────────────────────────────

export type ModelSelectorCommandProps = ComponentProps<typeof Command>

export const ModelSelectorCommand = (props: ModelSelectorCommandProps) => <Command {...props} />

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>

export const ModelSelectorInput = (props: ModelSelectorInputProps) => <CommandInput {...props} />

export type ModelSelectorPanelProps = ComponentProps<typeof CommandPanel>

export const ModelSelectorPanel = (props: ModelSelectorPanelProps) => <CommandPanel {...props} />

export type ModelSelectorListProps = ComponentProps<typeof CommandList>

export const ModelSelectorList = (props: ModelSelectorListProps) => <CommandList {...props} />

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>

export const ModelSelectorEmpty = (props: ModelSelectorEmptyProps) => <CommandEmpty {...props} />

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>

export const ModelSelectorGroup = (props: ModelSelectorGroupProps) => <CommandGroup {...props} />

export type ModelSelectorGroupLabelProps = ComponentProps<typeof CommandGroupLabel>

export const ModelSelectorGroupLabel = (props: ModelSelectorGroupLabelProps) => (
  <CommandGroupLabel {...props} />
)

export type ModelSelectorCollectionProps = ComponentProps<typeof CommandCollection>

export const ModelSelectorCollection = (props: ModelSelectorCollectionProps) => (
  <CommandCollection {...props} />
)

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>

export const ModelSelectorItem = ({ className, ...props }: ModelSelectorItemProps) => (
  <CommandItem className={cn('gap-2', className)} {...props} />
)

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>

export const ModelSelectorShortcut = (props: ModelSelectorShortcutProps) => (
  <CommandShortcut {...props} />
)

export type ModelSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>

export const ModelSelectorSeparator = (props: ModelSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
)

// ── Display helpers ──────────────────────────────────────────────────

export type ModelSelectorLogoProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  provider?: string
}

export const ModelSelectorLogo = ({ provider, className, ...props }: ModelSelectorLogoProps) => (
  <img
    {...props}
    alt={`${provider} logo`}
    className={cn('size-4 dark:invert', className)}
    height={12}
    src={`https://models.dev/logos/${provider}.svg`}
    width={12}
  />
)

export type ModelSelectorLogoGroupProps = ComponentProps<'div'>

export const ModelSelectorLogoGroup = ({ className, ...props }: ModelSelectorLogoGroupProps) => (
  <div
    className={cn(
      'flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground',
      className,
    )}
    {...props}
  />
)

export type ModelSelectorNameProps = ComponentProps<'span'>

export const ModelSelectorName = ({ className, ...props }: ModelSelectorNameProps) => (
  <span className={cn('flex-1 truncate text-left', className)} {...props} />
)

const isFreeModel = (id: string) => id.endsWith(':free')

/**
 * Converts a per-token price string to a human-readable per-1M-token price.
 * e.g. "0.0000002" → "$0.20"
 * Returns null if the value is zero or unparseable.
 */
function formatPricePerMillion(raw: string): string | null {
  const perToken = parseFloat(raw)
  if (isNaN(perToken) || perToken === 0) return null
  const perMillion = perToken * 1_000_000
  const formatted =
    perMillion >= 1
      ? `$${perMillion.toFixed(perMillion >= 10 ? 0 : 1)}`
      : `$${perMillion.toPrecision(2)}`
  return formatted
}

/**
 * Compact pricing label showing input / output cost per 1M tokens.
 * Shows a "Free" badge if both prompt and completion are zero.
 */
function ModelPricing({ pricing, id }: { pricing: PublicPricing; id: string }) {
  if (isFreeModel(id)) {
    return <Badge variant="info">Free</Badge>
  }

  const input = formatPricePerMillion(pricing.prompt)
  const output = formatPricePerMillion(pricing.completion)

  if (!input && !output) {
    return <Badge variant="info">Free</Badge>
  }

  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      {input ?? '$0'} <span className="opacity-40">/</span> {output ?? '$0'}
    </span>
  )
}

export function ModelCapabilityBadges({ model }: { model: Model }) {
  const hasFileInput = model.architecture.input_modalities.includes('file')
  const hasTools = model.supported_parameters.includes('tools')

  return (
    <span className="ml-auto flex shrink-0 items-center gap-1.5">
      <ModelPricing id={model.id} pricing={model.pricing} />
      {hasFileInput && (
        <span className="text-muted-foreground" title="Supports file/document input">
          <FileTextIcon className="size-3" />
        </span>
      )}
      {hasTools && (
        <span className="text-muted-foreground" title="Supports tool use">
          <WrenchIcon className="size-3" />
        </span>
      )}
    </span>
  )
}

export function formatContextLength(tokens: number): string {
  if (tokens >= 1_000_000) {
    const val = tokens / 1_000_000
    return `${val % 1 === 0 ? val : val.toFixed(1)}M`
  }
  const k = tokens / 1_000
  return `${k % 1 === 0 ? k : k.toFixed(0)}K`
}

export function formatKnowledgeCutoff(raw: string): string | null {
  const match = raw.match(/^(\d{4})-(\d{2})/)
  if (!match) return null
  const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
