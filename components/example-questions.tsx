import { Question } from "@/lib/questions/types"
import { FancyButton } from "./ui/fancy-button"
import { vibrate } from "@/lib/vibrate"

type ExampleQuestionsProps = {
  questions: Question[]
  addMessage: (input: string) => Promise<void>
}

export function ExampleQuestions({ questions, addMessage }: ExampleQuestionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
      {questions.map((q) => (
        <FancyButton
          key={q.content}
          onClick={() => {
            vibrate()
            addMessage(q.content)
          }}
        >
          {q.content}
        </FancyButton>
      ))}
    </div>
  )
}
