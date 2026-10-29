import { useHotkey } from "@tanstack/react-hotkeys"
// https://ui.shadcn.com/docs/dark-mode/tanstack-start
import { ScriptOnce } from "@tanstack/react-router"
import { createContext, use, useEffect, useState } from "react"

import { siteConfig } from "@/config/site"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)
  const colors = JSON.stringify(siteConfig.themeColors)

  return `(function(){try{var c=${colors};var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c[r])}catch(e){}})();`
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
})

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")

  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  root.classList.add(resolved)
  root.style.colorScheme = resolved

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute("content", siteConfig.themeColors[resolved])
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    // oxlint-disable-next-line react/set-state-in-effect
    setThemeState(
      stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme,
    )
    setMounted(true)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    setThemeState(next)
  }

  return (
    <ThemeProviderContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      <ThemeHotkey />
      {children}
    </ThemeProviderContext>
  )
}

function ThemeHotkey() {
  const { theme, setTheme } = useTheme()

  useHotkey(
    "T",
    () => {
      const resolved =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme
      setTheme(resolved === "dark" ? "light" : "dark")
    },
    { requireReset: true },
  )

  return null
}

export function useTheme() {
  const context = use(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
