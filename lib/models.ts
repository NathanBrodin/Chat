// See https://openrouter.ai/models.
// Free models only — safe for testing the template without spending credits.
export const MODELS = [
  { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B (free)" },
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    name: "Nemotron 3 Nano Reasoning (free)",
  },
  { id: "liquid/lfm-2.5-2.6b:free", name: "LFM 2.5 2.6B (free)" },
]

export const DEFAULT_MODEL = MODELS[0].id

export interface ChatModel {
  id: string
  name: string
}

export function isModelAllowed(id: string) {
  return MODELS.some((model) => model.id === id)
}
