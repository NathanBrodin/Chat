import { SiGithub } from "@icons-pack/react-simple-icons"
import { ArrowUpRightIcon, EllipsisIcon, SunMoonIcon } from "lucide-react"

import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MenuLinkItem,
} from "@/components/ui/menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { siteConfig } from "@/lib/site"

export function ProjectMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton aria-label="More" className="size-8 shrink-0" tooltip="More" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" side="right" sideOffset={8}>
        <p className="px-2 py-1.5 text-xs text-muted-foreground">{siteConfig.description}</p>
        <DropdownMenuSeparator />
        <div className="flex min-h-8 items-center gap-2 rounded-sm px-2 py-1 text-base sm:min-h-7 sm:text-sm">
          <SunMoonIcon aria-hidden="true" className="size-4 shrink-0 opacity-80" />
          Theme
          <div className="ms-auto text-muted-foreground">
            <ThemeSwitcher />
          </div>
        </div>
        <DropdownMenuSeparator />
        <MenuLinkItem
          closeOnClick
          href={`https://github.com/${siteConfig.githubRepo}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub aria-hidden="true" />
          GitHub
        </MenuLinkItem>
        <MenuLinkItem
          closeOnClick
          href={siteConfig.authorUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ArrowUpRightIcon aria-hidden="true" />
          Portfolio
        </MenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
