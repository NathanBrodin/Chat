import { Link } from "@tanstack/react-router"

import { AppLogo } from "@/components/app-logo"

import { Button } from "./ui/button"

export function DefaultNotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center"
    >
      <title>Page not found | Nathan&apos;s AI</title>
      <meta name="robots" content="noindex" />

      <Link to="/" aria-label="Nathan's AI home">
        <AppLogo />
      </Link>

      <div className="flex max-w-md flex-col gap-2">
        <p className="font-mono text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          404
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button render={<Link to="/" />}>Home</Button>
        <Button variant="secondary" render={<a href="/about" aria-label="About" />}>
          About
        </Button>
      </div>
    </main>
  )
}
