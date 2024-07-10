"use server";

import { ChatMessage } from "@/lib/types";
import { v4 as uuid } from "uuid";

export async function getAssistantResponse(
  userInput: string,
): Promise<ChatMessage> {
  return {
    id: uuid(),
    content: `I received your message: "${userInput}". However, I don't have the knowledge to provide a meaningful answer.`,
    role: "assistant",
    status: "complete",
  };
}
