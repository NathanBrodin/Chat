import { motion } from "framer-motion"
import { Questions } from "@/lib/chat/types"
import { ExampleQuestions } from "./example-questions"
import { IconNathansAI } from "./ui/icons"

type EmptyConversationProps = {
  addMessage: (input: string) => Promise<void>
}

const questions: Questions = {
  questions: [
    {
      display: "Do I have expertise in React",
      question: "Do Nathan have expertise in React",
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
  ],
}

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
      <ExampleQuestions exampleQuestions={questions} addMessage={addMessage} />
    </motion.div>
  )
}
