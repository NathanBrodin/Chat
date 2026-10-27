import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import {
  getCookie,
  getRequestProtocol,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server"
import { z } from "zod"

const SIDEBAR_OPEN_COOKIE = "conversations_sidebar_open"
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

export const $getSidebarOpen = createServerFn({ method: "GET" }).handler(() => {
  setResponseHeader("Cache-Control", "private, no-store")
  return getCookie(SIDEBAR_OPEN_COOKIE) !== "false"
})

export const sidebarOpenQueryOptions = () =>
  queryOptions({
    queryKey: ["conversations", "sidebar-open"],
    queryFn: ({ signal }) => $getSidebarOpen({ signal }),
  })

export const $setSidebarOpen = createServerFn({ method: "POST" })
  .validator(z.object({ open: z.boolean() }))
  .handler(({ data }) => {
    setCookie(SIDEBAR_OPEN_COOKIE, String(data.open), {
      httpOnly: true,
      maxAge: ONE_YEAR_IN_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: getRequestProtocol() === "https",
    })
  })
