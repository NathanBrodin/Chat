import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/types";
import { getAssistantResponse } from "@/app/actions";
import { v4 as uuid } from "uuid";

type PromptFormProps = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export function PromptForm({ messages, setMessages }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when the component mounts and after each message is sent
    inputRef.current?.focus();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get("input") as string;

    if (!userInput.trim()) return;

    setIsLoading(true);

    // Immediately add user message and loading message to the state
    const newUserMessage: ChatMessage = {
      id: uuid(),
      content: userInput,
      role: "user",
    };
    const loadingMessage: ChatMessage = {
      id: uuid(),
      content: "",
      role: "assistant",
      status: "loading",
    };
    setMessages((prev) => [...prev, newUserMessage, loadingMessage]);

    // Reset the form
    form.reset();

    // Get the assistant's response
    const assistantMessage = await getAssistantResponse(userInput);

    // Update the state with the assistant's message
    setMessages((prev) => [
      ...prev.slice(0, -1), // Remove the loading message
      assistantMessage,
    ]);

    setIsLoading(false);
  }

  return (
    <form
      ref={formRef}
      className="flex w-full items-center space-x-2"
      onSubmit={handleSubmit}
    >
      <Input
        ref={inputRef}
        type="text"
        name="input"
        placeholder="How can the Nathan help you today?"
        autoComplete="off"
        disabled={isLoading}
        className="w-96"
      />
      <Button type="submit" disabled={isLoading} className="w-32">
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
