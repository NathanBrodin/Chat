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

type PartMetadata = {
  state: string
  text: string
  type: string
  providerMetadata?: {
    openrouter: {
      provider: string
      usage: {
        completionTokens: number
        completionTokensDetails: { reasoningTokens: number }
        cost: number
        costDetails: {
          upstreamInferenceCost: number
        }
        promptTokens: number
        promptTokensDetails: {
          cachedTokens: number
        }
        totalTokens: number
      }
    }
  }
}

function toFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const fmtPercent = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1, style: 'percent' })
const fmtCompact = new Intl.NumberFormat('en-US', { notation: 'compact' })
const fmtUSD = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })

type UsageStats = {
  inputTokens: number
  outputTokens: number
  usedTokens: number
  costUSD: number
  inputCostUSD: number
  outputCostUSD: number
}

function aggregateUsage(
  results: typeof useChatContext extends () => { results: infer R } ? R : never,
): UsageStats {
  const stats: UsageStats = {
    inputTokens: 0,
    outputTokens: 0,
    usedTokens: 0,
    costUSD: 0,
    inputCostUSD: 0,
    outputCostUSD: 0,
  }

  for (const { parts } of results) {
    for (const part of parts) {
      const metadata = (part as PartMetadata).providerMetadata
      if (!metadata) continue

      for (const { usage } of Object.values(metadata)) {
        if (!usage) continue

        const input = toFiniteNumber(usage.promptTokens)
        const output = toFiniteNumber(usage.completionTokens)
        const total = toFiniteNumber(usage.totalTokens) || input + output
        const cost = toFiniteNumber(usage.cost)

        stats.inputTokens += input
        stats.outputTokens += output
        stats.usedTokens += total
        stats.costUSD += cost

        const tokenSum = input + output
        if (cost > 0 && tokenSum > 0) {
          stats.inputCostUSD += (cost * input) / tokenSum
          stats.outputCostUSD += (cost * output) / tokenSum
        }
      }
    }
  }

  return stats
}

export function ChatContext() {
  const { results, model } = useChatContext()

  const { inputTokens, outputTokens, usedTokens, costUSD, inputCostUSD, outputCostUSD } =
    aggregateUsage(results)

  const maxTokens = Math.max(0, model.context_length ?? 0)
  const usedPercent = maxTokens > 0 ? Math.min(1, usedTokens / maxTokens) : 0

  return (
    <PreviewCard>
      <PreviewCardTrigger delay={0} render={<Button variant="outline" />}>
        <span className="text-sm text-muted-foreground tabular-nums">
          {fmtPercent.format(usedPercent)}
        </span>
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
              <ProgressValue>
                {() => `${fmtCompact.format(usedTokens)} / ${fmtCompact.format(maxTokens)}`}
              </ProgressValue>
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
              {fmtCompact.format(inputTokens)}
              <span className="ml-2 text-muted-foreground">• {fmtUSD.format(inputCostUSD)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Output</span>
            <span>
              {fmtCompact.format(outputTokens)}
              <span className="ml-2 text-muted-foreground">• {fmtUSD.format(outputCostUSD)}</span>
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 bg-secondary p-3">
          <span className="text-muted-foreground">Total cost</span>
          <span>{fmtUSD.format(costUSD)}</span>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  )
}
