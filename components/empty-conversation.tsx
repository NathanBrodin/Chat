import { Geo } from "@vercel/edge"
import { motion } from "framer-motion"
import { ExampleQuestions } from "./example-questions"
import Dazzle from "./ui/dazzle"
import { IconNathansAI } from "./ui/icons"

type EmptyConversationProps = {
  location: Geo
  addMessage: (input: string) => Promise<void>
}

export function EmptyConversation({ location, addMessage }: EmptyConversationProps) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-1"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
    >
      <IconNathansAI className="size-12" />
      <Dazzle text="Nathan's " accent="AI." />
      <ExampleQuestions location={location} addMessage={addMessage} />
    </motion.div>
  )
}
