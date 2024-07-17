import { motion } from "framer-motion"
import { IconNathansAI } from "./ui/icons"

export function EmptyConversation() {
  return (
    <motion.div
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
    >
      <IconNathansAI className="size-12" />
      <h1 className="text-xl font-semibold">Nathan&apos;s AI</h1>
    </motion.div>
  )
}
