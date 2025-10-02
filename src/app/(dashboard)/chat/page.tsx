"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"
import BackgroundIcons from "@/components/BackgroundIcons"
import { useAuth } from "@/hooks/useAuth"
import { useConversations } from "@/hooks/useConversations"
import type { ChatMessage } from "@/types"

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createConversation } = useConversations()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleSendFirstMessage = async (content: string) => {
    if (!content.trim()) return

    let conversationId: string | null = null

    if (user) {
      // Crear conversación en BD para usuarios autenticados
      const conv = await createConversation()
      if (!conv?.id) return
      conversationId = conv.id
    }

    // Guardar mensaje temporal si es usuario anónimo
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    // Redirigir a la conversación creada si hay ID
    if (conversationId) {
      router.replace(`/chat/${conversationId}`)
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      <BackgroundIcons />

      <ChatSidebar
        user={user}
        conversations={[]} // ninguna conversación aún
        selectedConversationId={null}
        onSelectConversation={() => {}}
        onCreateConversation={() => {}}
      />

      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSendFirstMessage} />
      </div>
    </div>
  )
}
