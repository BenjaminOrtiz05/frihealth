"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"
import BackgroundIcons from "@/components/BackgroundIcons"
import { useAuth } from "@/hooks/useAuth"
import { useConversations } from "@/hooks/useConversations"
import { useMessages } from "@/hooks/useMessages"
import type { ChatMessage } from "@/types"

export default function ChatWithIdPage() {
  const params = useParams()
  const chatId = params.id as string

  const { user, loading } = useAuth()
  const { conversations } = useConversations()
  const { messages, sendMessage } = useMessages(chatId)

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])

  // Combinar mensajes de hook con local para actualizar en tiempo real
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Usuario autenticado: mensaje persistente
    if (user) {
      const msg = await sendMessage(content)
      if (msg) setLocalMessages((prev) => [...prev, msg])
    } else {
      // Usuario anónimo: mensaje temporal
      const tempMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      }
      setLocalMessages((prev) => [...prev, tempMsg])
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      <BackgroundIcons />

      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedConversationId={chatId}
        onSelectConversation={() => {}}
        onCreateConversation={() => {}}
      />

      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={localMessages} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
