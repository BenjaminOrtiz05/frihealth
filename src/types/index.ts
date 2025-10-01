// Roles en mensajes y usuarios
export type Role = "user" | "assistant" | "system"

// Payload esperado en /api/messages
export interface MessagePayload {
  content: string
  conversationId?: string
}

// Payload esperado en /api/conversations
export interface ConversationPayload {
  title?: string
}

// Respuesta del asistente
export interface AssistantResponse {
  content: string
  urgent?: boolean
  specialty?: string
}

// Mensajes en frontend
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

// Usuario
export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  createdAt: Date
}

// Conversación
export interface Conversation {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Registro de síntomas
export interface SymptomLog {
  id: string
  userId: string
  symptom: string
  severity: number
  notes?: string
  createdAt: Date
}
