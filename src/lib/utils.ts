export { cn } from "cn"

// Only allow http(s) URLs to reach an href, so untrusted model/web/tool output
// can't smuggle a javascript: or data: scheme into a link.
export function safeHttpUrl(url: string): string | undefined {
  try {
    const { protocol } = new URL(url)
    return protocol === "http:" || protocol === "https:" ? url : undefined
  } catch {
    return undefined
  }
}
