import { Geo } from "@vercel/edge"

export type Question = {
  content: string
  locations: Geo[]
}
