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
    <div className="flex min-h-svh flex-col bg-sidebar px-8 py-8">
      <main className="container">
        <Link
          to="/"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to chat
        </Link>
        <CardFrame>
          <Card>
            <CardHeader className="">
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
        <Footer />
      </main>
    </div>
  )
}
