import { motion } from "framer-motion"
import { IconNathansAI } from "./ui/icons"

export function EmptyConversation() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2"
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
    </motion.div>
  )
}
