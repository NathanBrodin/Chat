import { Geo } from "@vercel/edge"
import { Question } from "./types"

export function getQuestions(location: Geo): Question[] {
  const contents: Question[] = [
    {
      content: "Tell me about my studies",
      locations: [],
    },
    {
      content: "What tech do I work with?",
      locations: [],
    },
    {
      content: "What awards have I won?",
      locations: [],
    },
    {
      content: "What certifications do I have?",
      locations: [],
    },
    {
      content: "Where have I interned?",
      locations: [],
    },
    {
      content: "What projects have I done?",
      locations: [],
    },
    {
      content: "What's my tech stack like?",
      locations: [],
    },
    {
      content: "What languages do I speak?",
      locations: [],
    },
    {
      content: "How have I volunteered?",
      locations: [],
    },
    {
      content: "Who's recommended me?",
      locations: [],
    },
    {
      content: "Where am I from originally?",
      locations: [],
    },
    {
      content: "What degree am I going for?",
      locations: [],
    },
  ]

  return contents
}
