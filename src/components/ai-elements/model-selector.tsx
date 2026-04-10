import type { ComponentProps } from 'react'

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
