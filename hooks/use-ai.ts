import { useActions as untypedUseActions, useUIState as untypedUseUIState } from "ai/rsc"
import { AI } from "@/lib/chat/actions"

export function useUIState() {
  return untypedUseUIState<typeof AI>()
}

export function useActions() {
  return untypedUseActions<typeof AI>()
}
