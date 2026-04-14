import type { UIMessage } from 'ai'

import { nanoid } from 'nanoid'

const STORAGE_KEY = 'chat:conversations'
const MESSAGE_KEY_PREFIX = 'chat:messages:'

export interface LocalConversation {
  id: string
  title: string
  updatedAt: number
}

function getConversationIndex(): LocalConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LocalConversation[]) : []
  } catch {
    return []
  }
}

function setConversationIndex(conversations: LocalConversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function createLocalConversation(title: string): string {
  const id = `local_${nanoid()}`
  const conversations = getConversationIndex()
  conversations.unshift({ id, title, updatedAt: Date.now() })
  setConversationIndex(conversations)
  localStorage.setItem(MESSAGE_KEY_PREFIX + id, '[]')
  return id
}

export function listLocalConversations(): LocalConversation[] {
  return getConversationIndex().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function loadLocalMessages(id: string): UIMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGE_KEY_PREFIX + id)
    return raw ? (JSON.parse(raw) as UIMessage[]) : []
  } catch {
    return []
  }
}

export function saveLocalMessages(id: string, messages: UIMessage[]) {
  localStorage.setItem(MESSAGE_KEY_PREFIX + id, JSON.stringify(messages))

  // Update the conversation's updatedAt timestamp
  const conversations = getConversationIndex()
  const conversation = conversations.find((c) => c.id === id)
  if (conversation) {
    conversation.updatedAt = Date.now()
    setConversationIndex(conversations)
  }
}

export function renameLocalConversation(id: string, title: string) {
  const conversations = getConversationIndex()
  const conversation = conversations.find((c) => c.id === id)
  if (conversation) {
    conversation.title = title
    setConversationIndex(conversations)
  }
}

export function deleteLocalConversation(id: string) {
  const conversations = getConversationIndex().filter((c) => c.id !== id)
  setConversationIndex(conversations)
  localStorage.removeItem(MESSAGE_KEY_PREFIX + id)
}

export function isLocalConversation(id: string): boolean {
  return id.startsWith('local_')
}
