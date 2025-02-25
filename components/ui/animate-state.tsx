import { AnimatePresence, motion } from "motion/react"
import React from "react"

const variants = {
  initial: { opacity: 0, y: -25 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 25 },
}

export function AnimatedState({ children }: { children: React.ReactNode }) {
  const getKey = (): string => {
    if (React.isValidElement(children)) {
      return children.type.toString()
    }
    return children?.toString() ?? ""
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        initial="initial"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        key={getKey()}
        className="flex w-full items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
