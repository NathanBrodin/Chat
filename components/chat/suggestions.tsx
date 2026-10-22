"use client"

import { Button } from "@/components/ui/button"

const suggestions = [
  {
    label: "Tell me a story",
    prompt:
      "Tell me a short story. Format it in rich markdown: a title heading, a blockquote, a bulleted list, a table, and some bold and italic text.",
  },
  {
    label: "What's new in Next.js",
    prompt:
      "Search the web for the latest Next.js release and summarize what's new.",
  },
  {
    label: "Look up a repo",
    prompt: "What are the GitHub stats for vercel/next.js?",
  },
  {
    label: "Plan a dinner",
    prompt:
      "Help me plan a birthday dinner — ask me a few clarifying questions first, then suggest a menu.",
  },
]

export function Suggestions({
  onSelect,
}: {
  onSelect: (prompt: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.label}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion.prompt)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
