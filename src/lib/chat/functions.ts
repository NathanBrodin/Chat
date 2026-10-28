import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { isValidChatId } from "@/lib/chat/chat-id"
import { getConversation, listConversations } from "@/lib/chat/store"

export const $listConversations = createServerFn({ method: "GET" }).handler(async () => {
  return listConversations()
})

export const $getConversation = createServerFn({ method: "GET", strict: { output: false } })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const conversation = isValidChatId(data.id) ? await getConversation(data.id) : null

    if (!conversation) {
      throw notFound()
    }

    return conversation
  })
