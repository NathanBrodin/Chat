"use server";

import { ChatMessage } from "@/lib/types";
import { v4 as uuid } from "uuid";

export async function addMessage(prevState: ChatMessage[], formData: FormData) {
  const input = formData.get("input");

  if (!input || input === "") return prevState;

  const newMessage: ChatMessage = {
    id: uuid(),
    content: input.toString(),
    role: "user",
  };

  const newFakeMessage: ChatMessage = {
    id: uuid(),
    content:
      "I am sorry but I don't have the knowledge to answer this question",
    role: "assistant",
  };

  return [...prevState, newMessage, newFakeMessage];
}
