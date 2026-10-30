import { Button } from "@/components/ui/button"

const suggestions = [
  {
    label: "What are you working on?",
    prompt: "What are you working on at Capia right now, and what does it involve?",
  },
  {
    label: "What's the most interesting thing you've built?",
    prompt: "What's the most technically interesting thing you've built, and why?",
  },
  {
    label: "How did you end up in Tromsø?",
    prompt: "How did you end up in Tromsø?",
  },
  {
    label: "What's your stack?",
    prompt: "What's your tech stack, and what do you reach for on a new project?",
  },
  {
    label: "How was this chat built?",
    prompt: "How was this chat built?",
  },
]

export function Suggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
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
