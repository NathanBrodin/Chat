import { openrouter } from "@openrouter/ai-sdk-provider"

// OpenRouter exposes web search as a server tool that works with any model,
// so unlike provider-native search there is nothing model-specific to pick.
export function getWebSearch() {
  return openrouter.tools.webSearch({})
}
