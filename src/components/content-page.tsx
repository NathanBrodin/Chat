import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Footer } from "@/components/footer"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
})

type ContentPageProps = {
  readonly title: string
  readonly description: string
  readonly lastUpdated?: string
  readonly children: ReactNode
}

export function ContentPage({ title, description, lastUpdated, children }: ContentPageProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12 md:gap-12 md:px-8 md:py-20"
      >
        <header className="flex flex-col gap-4">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Back to chat
          </Link>

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
        </header>

        <article className="typeset max-w-[68ch]">{children}</article>
      </main>

      <Footer />
    </div>
  )
}
