import { Geo } from "@vercel/edge"
import { getQuestions } from "@/lib/questions/actions"
import { FancyButton } from "./ui/fancy-button"

type ExampleQuestionsProps = {
  location: Geo
  addMessage: (input: string) => Promise<void>
}

export function ExampleQuestions({ location, addMessage }: ExampleQuestionsProps) {
  const exampleQuestions = getQuestions(location)

  return (
    <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
      {exampleQuestions.map((q) => (
        <FancyButton key={q.display} onClick={() => addMessage(q.question)}>
          {q.display}
        </FancyButton>
      ))}
    </div>
  )
}
