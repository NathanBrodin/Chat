import "server-only"

import { Geo } from "@vercel/edge"
import { Question } from "./types"

export async function getQuestions(_location: Geo): Promise<Question[]> {
  "use server"

  const contents: Question[] = [
    {
      content: "Tell me about your studies",
      locations: [],
    },
    {
      content: "What tech do you work with?",
      locations: [],
    },
    {
      content: "What awards have you won?",
      locations: [],
    },
    {
      content: "What certifications do you have?",
      locations: [],
    },
    {
      content: "Where have you interned?",
      locations: [],
    },
    {
      content: "What projects have you done?",
      locations: [],
    },
    {
      content: "What's your tech stack like?",
      locations: [],
    },
    {
      content: "What languages do you speak?",
      locations: [],
    },
    {
      content: "How have you volunteered?",
      locations: [],
    },
    {
      content: "Who's recommended you?",
      locations: [],
    },
    {
      content: "Where are you from originally?",
      locations: [],
    },
    {
      content: "What degree are you going for?",
      locations: [],
    },
  ]

  return contents.sort(() => Math.random() - 0.5).slice(0, 4)
}
