"use client"

import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import type { ChatMessage } from "@/types"

interface ChatWindowProps {
  messages: ChatMessage[]
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔹 Hace scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50 to-gray-100 border-t border-l border-r border-gray-200 rounded-t-xl">
      {messages.length === 0 && (
        <p className="text-center text-gray-400">Aquí aparecerán tus mensajes</p>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} sender={msg.role} text={msg.content} />
      ))}

      {/* 👇 marcador invisible al final para scrollear */}
      <div ref={bottomRef} />
    </div>
  )
}
