import { Button } from '@/components/ui/button'
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressTrack,
  CircularProgressRange,
} from '@/components/ui/circular-progress'
import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from '@/components/ui/preview-card'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/components/ui/progress'

import { useChatContext } from '.'

type UsageMetadata = {
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  cost?: number
}

type ProviderMetadataEntry = {
  usage?: UsageMetadata
}

type MessageWithProviderMetadata = {
  providerMetadata?: Record<string, ProviderMetadataEntry | undefined> | null
}

function toFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function ChatContext() {
  const { results, model } = useChatContext()

  let inputTokens = 0
  let outputTokens = 0
  let usedTokens = 0
  let costUSD = 0
  let inputCostUSD = 0
  let outputCostUSD = 0

  for (const message of results) {
    const providerMetadata = (message as MessageWithProviderMetadata).providerMetadata

    if (!providerMetadata || typeof providerMetadata !== 'object') {
      continue
    }

    for (const provider of Object.values(providerMetadata)) {
      const usage = provider?.usage
      if (!usage || typeof usage !== 'object') {
        continue
      }

      const promptTokens = toFiniteNumber(usage.promptTokens)
      const completionTokens = toFiniteNumber(usage.completionTokens)
      const totalTokens = toFiniteNumber(usage.totalTokens) || promptTokens + completionTokens
      const cost = toFiniteNumber(usage.cost)

      inputTokens += promptTokens
      outputTokens += completionTokens
      usedTokens += totalTokens
      costUSD += cost

      const totalForSplit = promptTokens + completionTokens
      if (cost > 0 && totalForSplit > 0) {
        inputCostUSD += (cost * promptTokens) / totalForSplit
        outputCostUSD += (cost * completionTokens) / totalForSplit
      }
    }
  }

  const maxTokens = Math.max(0, model.context_length ?? 0)

  const usedPercent = maxTokens > 0 ? Math.min(1, usedTokens / maxTokens) : 0
  const displayPct = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    style: 'percent',
  }).format(usedPercent)
  const used = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(usedTokens)
  const total = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(maxTokens)

  const usedInputTokens = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(inputTokens)

  const usedOutputTokens = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(outputTokens)

  const inputCost = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(inputCostUSD)

  const outputCost = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(outputCostUSD)

  const totalCost = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(costUSD ?? 0)

  return (
    <PreviewCard>
      <PreviewCardTrigger delay={0} render={<Button variant="outline" />}>
        <span className="text-sm text-muted-foreground tabular-nums">{displayPct}</span>
        <CircularProgress value={usedPercent * 100} size={24} thickness={2}>
          <CircularProgressIndicator>
            <CircularProgressTrack />
            <CircularProgressRange />
          </CircularProgressIndicator>
        </CircularProgress>
      </PreviewCardTrigger>
      <PreviewCardPopup align="end" className="flex flex-col divide-y p-0">
        <div className="w-full space-y-2 p-3">
          <Progress value={usedPercent * 100}>
            <div className="flex items-center justify-between gap-2">
              <ProgressLabel>Context Limit</ProgressLabel>
              <ProgressValue>{(_formatted, _value) => `${used} / ${total}`}</ProgressValue>
            </div>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>
        <div className="w-full p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Input</span>
            <span>
              {usedInputTokens}
              <span className="ml-2 text-muted-foreground">• {inputCost}</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Output</span>
            <span>
              {usedOutputTokens}
              <span className="ml-2 text-muted-foreground">• {outputCost}</span>
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 bg-secondary p-3">
          <span className="text-muted-foreground">Total cost</span>
          <span>{totalCost}</span>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  )
}
