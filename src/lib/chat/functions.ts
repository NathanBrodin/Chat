import { createServerFn } from "@tanstack/react-start"

import { isValidChatId } from "@/lib/chat/chat-id"
import { getConversation, listConversations } from "@/lib/chat/store"

export const $listConversations = createServerFn({ method: "GET" }).handler(async () => {
  return listConversations()
})

export const $getConversation = createServerFn({ method: "GET", strict: { output: false } })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidChatId(data.id)) {
      return null
    }

    return getConversation(data.id)
  })
