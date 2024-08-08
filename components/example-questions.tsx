import { Questions } from "@/lib/chat/types"
import { FancyButton } from "./ui/fancy-button"

type ExampleQuestionsProps = {
  exampleQuestions: Questions
  addMessage: (input: string) => Promise<void>
}

export function ExampleQuestions({ exampleQuestions, addMessage }: ExampleQuestionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
      {exampleQuestions.questions.map((q) => (
        <FancyButton key={q.display} onClick={() => addMessage(q.question)}>
          {q.display}
        </FancyButton>
      ))}
    </div>
  )
}
