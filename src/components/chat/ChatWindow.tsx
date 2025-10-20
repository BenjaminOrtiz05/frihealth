// src/components/chat/ChatWindow.tsx
"use client"

import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import type { ChatMessage } from "@/types"
import { useConversations } from "@/hooks/useConversations"

interface ChatWindowProps {
  messages: ChatMessage[]
  conversationId?: string
  token?: string
}

export default function ChatWindow({ messages, conversationId, token }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { updateLastMessage } = useConversations(token)

  // 🔹 Hace scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 🔹 Actualiza el último mensaje del usuario en tiempo real
  useEffect(() => {
    if (!conversationId || messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.role === "user") {
      updateLastMessage(conversationId, last.content)
    }
  }, [messages, conversationId, updateLastMessage])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-blue-50 to-gray-100 border-t border-l border-r border-gray-200 rounded-t-xl">
      {/* Área de mensajes scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">Aquí aparecerán tus mensajes</p>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.role} text={msg.content} />
        ))}

        {/* 👇 marcador invisible para el scroll automático */}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
