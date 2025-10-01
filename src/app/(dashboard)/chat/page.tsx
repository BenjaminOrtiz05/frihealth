"use client"

import { useState, useEffect } from "react"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"
import BackgroundIcons from "@/components/BackgroundIcons"
import { useAuth } from "@/hooks/useAuth"
import { useConversations } from "@/hooks/useConversations"
import { useMessages } from "@/hooks/useMessages"
import type { Conversation } from "@/types"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const { conversations, createConversation } = useConversations()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const { messages, sendMessage } = useMessages(selectedConversation?.id ?? undefined)

  // Selecciona la primera conversación registrada
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  const handleCreateConversation = async () => {
    const conv = await createConversation()
    if (conv) setSelectedConversation(conv)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      <BackgroundIcons />

      {/* Sidebar con historial o aviso */}
      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedConversationId={selectedConversation?.id ?? null}
        onSelectConversation={(id: string) => {
          const conv = conversations.find((c) => c.id === id)
          if (conv) setSelectedConversation(conv)
        }}
        onCreateConversation={handleCreateConversation}
      />

      {/* Main chat */}
      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={messages} />
        <ChatInput
          onSend={async (text: string) => {
            if (!selectedConversation) return
            await sendMessage(text)
          }}
        />
      </div>
    </div>
  )
}
