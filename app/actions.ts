"use server"

import { v4 as uuid } from "uuid"
import { ChatMessage } from "@/lib/types"

export async function getAssistantResponse(userInput: string): Promise<ChatMessage> {
  return {
    id: uuid(),
    content: `
I received your message: "${userInput}". However, I don't have the knowledge to provide a meaningful answer.
    
### Here's a list of what you can do _instead_:

- Ask the **real** ChatGPT, available on [chatgpt.com](https://chatgpt.com)
- Think by yourself, no need to ask for an AI to do your job if you do it yourself
- Stop working, why bother if it's too hard ?

In conclusion, Nathan's AI is not as smart as you expected it to be.
    `,
    role: "assistant",
    status: "complete",
  }
}
