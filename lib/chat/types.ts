import { Geo } from "@vercel/edge"
import { StreamableValue } from "@ai-sdk/rsc"
import { ReactNode } from "react"
import { allDocuments } from "contentlayer/generated"

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "error"
  display: ReactNode
}

export type AIState = { id: string; messages: ServerMessage[]; location: Geo }
export type UIState = ChatMessage[]

// Define the actions type
export type AIActions = {
  continueConversation: (input: string, location: Geo) => Promise<StreamableValue<any, any>>
}

// Define a generic DocumentType that all your content types conform to
export type DocumentType = (typeof allDocuments)[number]

// Create a map of all document types for easier access
export const documentCollections = {
  about: "allAbouts",
  award: "allAwards",
  certification: "allCertifications",
  education: "allEducation",
  experience: "allExperiences",
  language: "allLanguages",
  project: "allProjects",
  recommendation: "allRecommendations",
  volunteering: "allVolunteerings",
} as const

export type DocumentTag = keyof typeof documentCollections
