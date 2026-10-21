import type { Metadata } from "next"

import { Chat } from "@/components/chat"

export const metadata: Metadata = {
  title: "Chat",
  description:
    "A chatbot template built using shadcn/ui, shadcn/react and shadcn/typeset, powered by OpenRouter.",
}

export default function Page() {
  return <Chat />
}
