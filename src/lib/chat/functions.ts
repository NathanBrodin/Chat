import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { getConversation, listConversations } from "@/lib/chat/store"
import { isValidChatId } from "@/lib/chat/utils"

const listConversationsInput = z.object({
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(50).default(20),
})

export const $listConversations = createServerFn({ method: "GET" })
  .validator(listConversationsInput)
  .handler(async ({ data }) => {
    return listConversations(data)
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
