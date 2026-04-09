import type { ErrorComponentProps } from '@tanstack/react-router'

import { BugIcon, PrinterXIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from '@/components/ui/card'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ScrollArea } from '@/components/ui/scroll-area'

import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from './ui/preview-card'

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <main className="relative flex h-screen w-screen flex-1 flex-col items-center justify-center overflow-x-hidden px-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="text-destructive">
            <PrinterXIcon />
          </EmptyMedia>
          <EmptyTitle className="text-6xl text-destructive tabular-nums">Error</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={reset}>
              <RefreshCwIcon />
              Refresh the page
            </Button>
            <PreviewCard>
              <PreviewCardTrigger delay={0} render={<Button variant="outline" />}>
                <BugIcon />
                View error
              </PreviewCardTrigger>
              <PreviewCardPopup className="w-full max-w-3xl rounded-xl border-none p-0">
                <CardFrame className="w-full ">
                  <CardFrameHeader>
                    <CardFrameTitle className="text-base text-destructive">
                      {error.name}
                    </CardFrameTitle>
                    <CardFrameDescription>{error.message}</CardFrameDescription>
                  </CardFrameHeader>
                  <Card>
                    <CardPanel className="space-y-6">
                      <section className="space-y-2">
                        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Stack trace
                        </h2>
                        <ScrollArea className="h-72 rounded-lg border bg-muted/30" scrollFade>
                          <pre className="wrap-break-words p-4 font-mono text-xs leading-5 whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </ScrollArea>
                      </section>
                    </CardPanel>
                  </Card>
                </CardFrame>
              </PreviewCardPopup>
            </PreviewCard>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  )
}
