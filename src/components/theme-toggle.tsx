import { useTheme } from '@lonik/themer'
import { ComputerIcon, MoonIcon, SunIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setTheme(event.target.value)
  }

  return (
    <div className="flex items-center rounded-full border" onClick={(e) => e.stopPropagation()}>
      <input
        type="radio"
        id="light"
        name="theme"
        value="light"
        checked={theme === 'light'}
        onChange={handleThemeChange}
        className="hidden"
      />
      <label
        htmlFor="light"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex-1 cursor-pointer rounded-full p-1 transition-all',
          theme === 'light' ? 'border [&_svg]:text-foreground bg-background' : 'bg-transparent',
        )}
      >
        <SunIcon className="size-4" />
      </label>

      <input
        type="radio"
        id="dark"
        name="theme"
        value="dark"
        checked={theme === 'dark'}
        onChange={handleThemeChange}
        className="hidden"
      />
      <label
        htmlFor="dark"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex-1 cursor-pointer rounded-full p-1 transition-all',
          theme === 'dark' ? 'border [&_svg]:text-foreground bg-background' : 'bg-transparent',
        )}
      >
        <MoonIcon className="size-4" />
      </label>

      <input
        type="radio"
        id="system"
        name="theme"
        value="system"
        checked={theme === 'system'}
        onChange={handleThemeChange}
        className="hidden"
      />
      <label
        htmlFor="system"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex-1 cursor-pointer rounded-full p-1 transition-all',
          theme === 'system' ? 'border [&_svg]:text-foreground bg-background' : 'bg-transparent',
        )}
      >
        <ComputerIcon className="size-4" />
      </label>
    </div>
  )
}
