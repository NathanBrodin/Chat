import { SiGithub } from "@icons-pack/react-simple-icons"
import { useQuery } from "@tanstack/react-query"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { githubStarsQueryOptions } from "@/lib/github/queries"
import { site } from "@/lib/site"

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
})

export function GithubStarsButton() {
  const { data: stars } = useQuery(githubStarsQueryOptions())
  const count = stars == null ? null : compactNumber.format(stars).toLowerCase()
  const label = count
    ? `${count} stars on GitHub (opens in a new tab)`
    : "Open the GitHub repository (opens in a new tab)"

  return (
    <SidebarMenuButton
      className="w-auto! shrink-0 group-data-[collapsible=icon]:hidden"
      render={
        <a
          aria-label={label}
          href={`https://github.com/${site.githubRepo}`}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      tooltip={count ? `${count} stars on GitHub` : "View on GitHub"}
    >
      <SiGithub aria-hidden="true" />
      {count && (
        <span
          aria-hidden="true"
          className="text-xs text-muted-foreground tabular-nums group-data-[collapsible=icon]:hidden"
        >
          {count}
        </span>
      )}
    </SidebarMenuButton>
  )
}
