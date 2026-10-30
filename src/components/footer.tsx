import { Link } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 pt-4 md:mt-8 md:border-t md:pt-6">
      <p className="text-sm text-muted-foreground">
        Build by{" "}
        <a
          href={siteConfig.authorUrl}
          className="font-heading text-foreground hover:underline"
          target="_blank"
          rel="noopener"
        >
          {siteConfig.author}
        </a>
      </p>
      <div className="flex gap-4">
        <a
          href={`${siteConfig.url}/llms.txt`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          llms.txt
        </a>
        <Link
          to="/about"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
        <Link
          to="/privacy"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacy
        </Link>
      </div>
    </footer>
  )
}
