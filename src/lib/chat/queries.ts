import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { $getConversation, $listConversations } from "./functions"

export const CONVERSATIONS_PAGE_SIZE = 20

export const conversationsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ["conversations", "list", { limit: CONVERSATIONS_PAGE_SIZE }],
    queryFn: ({ pageParam, signal }) =>
      $listConversations({
        data: { offset: pageParam, limit: CONVERSATIONS_PAGE_SIZE },
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })

export const conversationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["conversation", id],
    queryFn: ({ signal }) => $getConversation({ data: { id }, signal }),
  })
