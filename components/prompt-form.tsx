import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/types";
import { getAssistantResponse } from "@/app/actions";
import { v4 as uuid } from "uuid";
import { Loader } from "lucide-react";
import { AnimatedState } from "./ui/animate-state";
import { minDelay } from "@/lib/min-delay";

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

    // Add user message to the state
    const newUserMessage: ChatMessage = {
      id: uuid(),
      content: userInput,
      role: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Reset the form
    form.reset();

    // Add a placeholder assistant message
    const assistantMessageId = uuid();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        status: "loading",
      },
    ]);

    // Get the assistant's response
    const assistantResponse = await minDelay(
      getAssistantResponse(userInput),
      500,
    );

    // Update the assistant's message with the response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantMessageId
          ? { ...assistantResponse, id: assistantMessageId }
          : msg,
      ),
    );

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
        <AnimatedState>
          {isLoading ? <Loader className="size-4 animate-spin" /> : "Send"}
        </AnimatedState>
      </Button>
    </form>
  );
}
