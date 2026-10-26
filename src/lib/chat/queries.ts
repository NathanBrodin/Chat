import { queryOptions } from "@tanstack/react-query"

import { $getConversation, $listConversations } from "./functions"

export const conversationsQueryOptions = () =>
  queryOptions({
    queryKey: ["conversations"],
    queryFn: ({ signal }) => $listConversations({ signal }),
  })

export const conversationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["conversation", id],
    queryFn: ({ signal }) => $getConversation({ data: { id }, signal }),
  })
