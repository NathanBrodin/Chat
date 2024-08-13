import { Geo } from "@vercel/edge"
import { Question } from "./types"

export function getQuestions(location: Geo): Question[] {
  const questions: Question[] = [
    {
      display: "Do I have expertise in React",
      question: "Do Nathan have expertise in React",
      locations: [],
    },
    {
      display: "What's my tech stack?",
      question: "What's Nathan's tech stack?",
      locations: [],
    },
    {
      display: "Where do I study?",
      question: "Where does Nathan study?",
      locations: [],
    },
    {
      display: "Do I speak Norwegian?",
      question: "Does Nathan speak Norwegian?",
      locations: [],
    },
  ]

  return questions
}
