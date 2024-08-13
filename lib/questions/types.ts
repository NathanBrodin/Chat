import { Geo } from "@vercel/edge"

export type Question = {
  question: string
  display: string
  locations: Geo[]
}
