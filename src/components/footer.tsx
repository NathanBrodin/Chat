import { SiGithub, SiX } from "@icons-pack/react-simple-icons"

import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="flex items-center justify-center border-t px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex w-full max-w-5xl flex-col justify-between gap-2 border-x px-4 py-2 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a
            className="underline underline-offset-4 transition-colors hover:text-foreground"
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="me noopener noreferrer"
          >
            Nathan Brodin<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>

        <div className="flex items-center gap-3 border-x bg-background px-4">
          <a
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            href="/llms.txt"
          >
            llms.txt
          </a>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          <a
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={siteConfig.xUrl}
            target="_blank"
            rel="me noopener noreferrer"
          >
            <SiX className="size-4" aria-hidden="true" />
            <span className="sr-only">X (opens in a new tab)</span>
          </a>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          <a
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="me noopener noreferrer"
          >
            <SiGithub className="size-4" aria-hidden="true" />
            <span className="sr-only">GitHub (opens in a new tab)</span>
          </a>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          <a
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="me noopener noreferrer"
          >
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          <a className="underline underline-offset-4 hover:text-foreground" href="/about">
            About
          </a>
          <span aria-hidden="true"> · </span>
          <a className="underline underline-offset-4 hover:text-foreground" href="/privacy">
            Privacy
          </a>
        </p>
      </div>
    </footer>
  )
}
