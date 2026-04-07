import { useTheme } from '@lonik/themer'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { MoonIcon } from '@/components/ui/icons/moon'
import { SunMediumIcon } from '@/components/ui/icons/sun-medium'
import { Kbd } from '@/components/ui/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  useHotkey('T', switchTheme)

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={switchTheme} />}>
        <MoonIcon className="relative hidden after:absolute after:-inset-2 dark:block" />
        <SunMediumIcon className="relative hidden not-dark:block after:absolute after:-inset-2" />
        <span className="sr-only">Theme Toggle</span>
      </TooltipTrigger>

      <TooltipContent>
        Toggle Theme
        <Kbd className="ml-1">T</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
