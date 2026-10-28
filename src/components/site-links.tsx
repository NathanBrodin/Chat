import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const linkClassName =
  "underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

type SiteLinksProps = {
  readonly className?: string
}

export function SiteLinks({ className }: SiteLinksProps) {
  return (
    <nav
      aria-label="Site links"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <a
        className={linkClassName}
        href={siteConfig.portfolioUrl}
        rel="me noopener noreferrer"
        target="_blank"
      >
        Portfolio
      </a>
      <a
        className={linkClassName}
        href={siteConfig.githubUrl}
        rel="me noopener noreferrer"
        target="_blank"
      >
        GitHub
      </a>
      <a className={linkClassName} href="/about">
        About
      </a>
      <a className={linkClassName} href="/privacy">
        Privacy
      </a>
      <a className={linkClassName} href="/llms.txt">
        AI index
      </a>
    </nav>
  )
}
