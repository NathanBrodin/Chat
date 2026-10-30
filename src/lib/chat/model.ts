export type Model = {
  id: string
  name: string
  contextWindow: number
  maxOutputTokens: number
  effort: "xhigh" | "high" | "medium" | "low" | "minimal" | "none"
}

export const model = {
  id: "z-ai/glm-5.3-flash",
  name: "GLM 5.3 Flash",
  contextWindow: 1_048_576,
  maxOutputTokens: 8192,
  effort: "low",
} satisfies Model
