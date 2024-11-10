import { Geo } from "@vercel/edge"
import { motion } from "framer-motion"
import { ExampleQuestions } from "./example-questions"
import { IconNathansAI } from "./ui/icons"
import Dazzle from "./ui/dazzle"

type EmptyConversationProps = {
  location: Geo
  addMessage: (input: string) => Promise<void>
}

export function EmptyConversation({ location, addMessage }: EmptyConversationProps) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-2"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
    >
      <Dazzle text="Nathan's " accent="AI." />
      <IconNathansAI className="size-12" />
      <h1 className="font-display text-5xl font-semibold">
        <span className="text-shadow-primary">Nathan&apos;s</span>
        {` `}
        <span className="text-shadow-accent text-gray-50">AI.</span>
      </h1>
      <ExampleQuestions location={location} addMessage={addMessage} />
    </motion.div>
  )
}
