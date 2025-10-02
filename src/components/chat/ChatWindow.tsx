"use client"

import MessageBubble from "./MessageBubble"
import type { ChatMessage } from "@/types"

interface ChatWindowProps {
  messages: ChatMessage[]
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50 to-gray-100 border-t border-l border-r border-gray-200 rounded-t-xl">
      {messages.length === 0 && (
        <p className="text-center text-gray-400">Aquí aparecerán tus mensajes</p>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} sender={msg.role} text={msg.content} />
      ))}
    </div>
  )
}
