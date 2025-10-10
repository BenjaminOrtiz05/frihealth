// Roles en mensajes y usuarios
export type Role = "user" | "assistant" | "system"

// Payload para enviar un mensaje
export interface MessagePayload {
  content: string
  conversationId?: string
}

// Payload para crear una conversación
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
  role: Role
  content: string
  createdAt: Date
  error?: string
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
  title: string
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

// Respuesta de autenticación
export interface AuthResponse {
  user: User | null
  token?: string
  error?: string
}
