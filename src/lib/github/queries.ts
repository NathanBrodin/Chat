import { queryOptions } from "@tanstack/react-query"

import { $getStargazersCount } from "./functions"

export const githubStarsQueryOptions = () =>
  queryOptions({
    queryKey: ["github", "stars"],
    queryFn: ({ signal }) => $getStargazersCount({ signal }),
    staleTime: 1000 * 60 * 60, // Star counts barely change
    retry: false,
  })
