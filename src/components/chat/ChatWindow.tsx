"use client"

import MessageBubble from "./MessageBubble"

export default function ChatWindow() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50 to-gray-100 border-t border-l border-r border-gray-200 rounded-t-xl">
      {/* Mensajes de ejemplo */}
      <MessageBubble sender="system" text="¡Hola! Soy tu asistente médico. ¿En qué puedo ayudarte hoy?" />
      <MessageBubble sender="user" text="Tengo dolor de cabeza desde ayer, ¿qué me recomiendas?" />
      <MessageBubble sender="system" text="Entiendo. ¿El dolor es leve, moderado o fuerte?" />
    </div>
  )
}
