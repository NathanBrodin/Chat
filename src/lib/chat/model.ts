export type Model = {
  id: string
  name: string
  contextWindow: number
  maxOutputTokens: number
}

export const model = {
  id: "~z-ai/glm-flash-latest",
  name: "GLM Flash Latest",
  contextWindow: 1_048_576,
  maxOutputTokens: 8192,
} satisfies Model
