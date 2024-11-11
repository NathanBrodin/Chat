import { Question } from "@/lib/questions/types"
import { FancyButton } from "./ui/fancy-button"

type ExampleQuestionsProps = {
  questions: Question[]
  addMessage: (input: string) => Promise<void>
}

export function ExampleQuestions({ questions, addMessage }: ExampleQuestionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
      {questions.map((q) => (
        <FancyButton key={q.content} onClick={() => addMessage(q.content)}>
          {q.content}
        </FancyButton>
      ))}
    </div>
  )
}
