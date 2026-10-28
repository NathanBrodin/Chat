import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Footer } from "@/components/footer"

import { Card, CardFrame, CardFrameFooter, CardHeader, CardPanel } from "./ui/card"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
})

type ContentPageProps = {
  title: string
  description: string
  lastUpdated?: string
  children: ReactNode
}

export function ContentPage({ title, description, lastUpdated, children }: ContentPageProps) {
  return (
    <div className="bg-sidebar">
      <div className="container">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to chat
        </Link>
        <main className="relative flex w-full min-w-0 flex-1 flex-col lg:mt-8 lg:mr-4 lg:mb-8">
          <CardFrame className="max-lg:border-none">
            <Card className="max-lg:rounded-none! max-lg:[clip-path:none]!">
              <CardHeader>
                <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  {title}
                </h1>

                <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
                  {description}
                </p>

                {lastUpdated ? (
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    <time dateTime={lastUpdated}>
                      {dateFormatter.format(new Date(`${lastUpdated}T00:00:00Z`))}
                    </time>
                  </p>
                ) : null}
              </CardHeader>
              <CardPanel>
                <article className="typeset">{children}</article>
              </CardPanel>
              <CardFrameFooter>
                <Footer />
              </CardFrameFooter>
            </Card>
          </CardFrame>
        </main>
      </div>
    </div>
  )
}
