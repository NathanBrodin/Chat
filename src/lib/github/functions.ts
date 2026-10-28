import { createServerFn } from "@tanstack/react-start"
import { ENV } from "varlock/env"
import { z } from "zod"

import { site } from "@/lib/site"

const REQUEST_TIMEOUT_MS = 5000

const repoResponseSchema = z.object({
  stargazers_count: z.number(),
})

/**
 * Returns `null` when GitHub can't be reached or the payload is unexpected:
 * the star count is decorative, so a failure shouldn't surface as an error.
 */
export const $getStargazersCount = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${site.githubRepo}`, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${ENV.GITHUB_API_TOKEN}`,
        "x-github-api-version": "2022-11-28",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      return null
    }

    const parsed = repoResponseSchema.safeParse(await response.json())
    return parsed.success ? parsed.data.stargazers_count : null
  } catch {
    return null
  }
})
