import { Geo } from "@vercel/edge"
import { getQuestions } from "@/lib/questions/actions"
import { FancyButton } from "./ui/fancy-button"

type ExampleQuestionsProps = {
  location: Geo
  addMessage: (input: string) => Promise<void>
}

export function ExampleQuestions({ location, addMessage }: ExampleQuestionsProps) {
  const allQuestions = getQuestions(location)

  // Get 4 random questions from the array
  const randomQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 4)

  return (
    <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
      {randomQuestions.map((q) => (
        <FancyButton key={q.content} onClick={() => addMessage(q.content)}>
          {q.content}
        </FancyButton>
      ))}
    </div>
  )
}
