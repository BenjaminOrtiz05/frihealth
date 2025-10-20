// src/components/chat/ChatHistoryCard.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import ChatCardMenu from "./ChatCardMenu"

interface ChatCardProps {
  title: string
  preview: string
  conversationId: string
  onDelete: () => void
  onSelect: () => void
}

export default function ChatCard({
  title,
  preview,
  conversationId,
  onDelete,
  onSelect,
}: ChatCardProps) {
  return (
    <Card
      onClick={onSelect}
      className="bg-white/90 border border-gray-200 shadow-sm rounded-xl 
      hover:shadow-md hover:scale-[1.01] transition-transform cursor-pointer mx-3 relative group"
    >
      <CardContent className="flex items-start gap-3 p-4">
        {/* Icono de chat */}
        <div className="p-2 rounded-lg bg-blue-50 text-blue-800 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-600 truncate">{preview}</p>
        </div>

        {/* Menu solo visible al hover */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()} // Evita que al hacer click en el menú se abra el chat
        >
          <ChatCardMenu conversationId={conversationId} onDelete={onDelete} />
        </div>
      </CardContent>
    </Card>
  )
}
