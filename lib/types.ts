export type Role = "assistant" | "user";

export interface ChatMessage {
  id: string;
  content: string;
  role: Role;
}
