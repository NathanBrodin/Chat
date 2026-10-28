import { ComputerIcon, MoonIcon, SunIcon } from "lucide-react"
import { Fragment, useId } from "react"

import { useTheme, type Theme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const THEMES = [
  { icon: ComputerIcon, label: "System", value: "system" },
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
] as const satisfies ReadonlyArray<{ icon: typeof SunIcon; label: string; value: Theme }>

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const id = useId()

  return (
    <div
      aria-label="Theme"
      className="flex h-fit w-fit items-center rounded-full border bg-background"
      role="radiogroup"
    >
      {THEMES.map(({ icon: Icon, label, value }) => (
        <Fragment key={value}>
          <input
            aria-label={label}
            checked={theme === value}
            className="sr-only"
            id={`${id}-${value}`}
            name={id}
            onChange={() => setTheme(value)}
            type="radio"
            value={value}
          />
          <label
            className={cn(
              "flex-1 cursor-pointer rounded-full border border-transparent bg-transparent p-1 transition-all hover:[&_svg]:text-foreground",
              theme === value && "border-border bg-background [&_svg]:text-foreground",
            )}
            htmlFor={`${id}-${value}`}
          >
            <Icon aria-hidden="true" className="size-4" />
          </label>
        </Fragment>
      ))}
    </div>
  )
}
