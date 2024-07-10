"use server";

import { ChatMessage } from "@/lib/types";
import { v4 as uuid } from "uuid";

const SIMULATED_DELAY = 2000; // 2 seconds delay

export async function getAssistantResponse(
  userInput: string,
): Promise<ChatMessage> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

  // Here you would typically send the userInput to your AI model and get a response
  // For now, we'll just return a mock response
  return {
    id: uuid(),
    content: `I received your message: "${userInput}". However, I don't have the knowledge to provide a meaningful answer.`,
    role: "assistant",
    status: "complete",
  };
}
