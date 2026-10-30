import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Footer } from "@/components/footer"

import { Card, CardFrame, CardHeader, CardPanel } from "./ui/card"
import { Separator } from "./ui/separator"

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
    <div className="flex min-h-dvh flex-col bg-background md:bg-sidebar md:px-8 md:py-8">
      <main className="mx-auto w-full max-w-[1416px] md:px-4 lg:px-6">
        <div className="px-4 pt-4 md:px-0 md:pt-0">
          <Link
            to="/"
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:mb-6"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Back to chat
          </Link>
        </div>
        <CardFrame className="max-md:rounded-none! max-md:border-0! max-md:bg-transparent! max-md:shadow-none! max-md:before:hidden">
          <Card className="max-md:m-0! max-md:rounded-none! max-md:border-x-0! max-md:shadow-none! max-md:[clip-path:none]! max-md:before:hidden">
            <CardHeader>
              <h1 className="scroll-m-20 font-heading text-3xl font-bold xl:text-4xl">{title}</h1>
              <p className="text-muted-foreground sm:text-lg">{description}</p>
              {lastUpdated ? (
                <p className="text-sm text-muted-foreground">
                  Last updated{" "}
                  <time dateTime={lastUpdated}>
                    {dateFormatter.format(new Date(`${lastUpdated}T00:00:00Z`))}
                  </time>
                </p>
              ) : null}
              <Separator />
            </CardHeader>
            <CardPanel>
              <article className="typeset typeset-docs">{children}</article>
            </CardPanel>
          </Card>
        </CardFrame>
        <div className="px-4 pb-4 md:px-0 md:pb-0">
          <Footer />
        </div>
      </main>
    </div>
  )
}
