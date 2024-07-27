import { motion } from "framer-motion"
import { FancyButton } from "./ui/fancy-button"
import { IconNathansAI } from "./ui/icons"

type EmptyConversationProps = {
  addMessage: (input: string) => Promise<void>
}

type Question = {
  display: string
  question: string
}

const questions: Question[] = [
  {
    display: "Do I need a VISA to work in Norway?",
    question: "Do Nathan need a VISA to work in Norway?",
  },
  {
    display: "What's my tech stack?",
    question: "What's Nathan's tech stack?",
  },
  {
    display: "Where do I study?",
    question: "Where does Nathan study?",
  },
  {
    display: "Do I speak Norwegian?",
    question: "Does Nathan speak Norwegian?",
  },
]

export function EmptyConversation({ addMessage }: EmptyConversationProps) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-2"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
    >
      <IconNathansAI className="size-12" />
      <h1 className="font-display text-5xl font-semibold">
        <span className="text-shadow-primary">Nathan&apos;s</span>
        {` `}
        <span className="text-shadow-accent text-gray-50">AI.</span>
      </h1>
      <div className="mt-4 flex flex-col gap-4 sm:grid sm:flex-none sm:grid-cols-2">
        {questions.map((q) => (
          <FancyButton key={q.display} onClick={() => addMessage(q.question)}>
            {q.display}
          </FancyButton>
        ))}
      </div>
    </motion.div>
  )
}
