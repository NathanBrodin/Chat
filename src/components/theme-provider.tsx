import { useHotkey } from "@tanstack/react-hotkeys"
// https://ui.shadcn.com/docs/dark-mode/tanstack-start
import { ScriptOnce } from "@tanstack/react-router"
import {
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react"

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

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme

  try {
    const stored = localStorage.getItem(storageKey)
    return isTheme(stored) ? stored : defaultTheme
  } catch {
    return defaultTheme
  }
}

type ThemeStore = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => Theme
  setTheme: (theme: Theme) => void
}

function createThemeStore(storageKey: string, defaultTheme: Theme): ThemeStore {
  let theme = readStoredTheme(storageKey, defaultTheme)
  const listeners = new Set<() => void>()

  const emit = () => {
    for (const listener of listeners) listener()
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== storageKey) return
    theme = readStoredTheme(storageKey, defaultTheme)
    emit()
  }

  return {
    subscribe: (listener) => {
      if (listeners.size === 0) window.addEventListener("storage", onStorage)
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener("storage", onStorage)
      }
    },
    getSnapshot: () => theme,
    setTheme: (next) => {
      theme = next
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // Storage can be unavailable; the in-memory theme still applies.
      }
      emit()
    },
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [store] = useState(() => createThemeStore(storageKey, defaultTheme))
  // The server cannot read localStorage, so it renders the default until the
  // client snapshot is available after hydration.
  const storedTheme = useSyncExternalStore<Theme | null>(
    store.subscribe,
    store.getSnapshot,
    () => null,
  )
  const theme = storedTheme ?? defaultTheme

  useLayoutEffect(() => {
    if (storedTheme === null) return
    applyTheme(storedTheme)
  }, [storedTheme])

  useEffect(() => {
    if (storedTheme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [storedTheme])

  return (
    <ThemeProviderContext value={{ theme, setTheme: store.setTheme }}>
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
