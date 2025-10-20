"use client"

import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
  const chatId = params.id as string

  const { user, token, loading: authLoading } = useAuth()
  const { conversations, deleteConversation } = useConversations(token ?? undefined)
  const { messages, sendMessage } = useMessages(chatId, token ?? undefined)

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])

  // 🔹 Cargar mensajes anónimos desde localStorage
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem(`anon-messages-${chatId}`)
      if (saved) setLocalMessages(JSON.parse(saved))
    }
  }, [chatId, user])

  // 🔹 Sincronizar con mensajes persistentes del backend
  useEffect(() => {
    if (user) setLocalMessages(messages)
  }, [messages, user])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    if (user) {
      const msg = await sendMessage(content)
      if (msg) setLocalMessages((prev) => [...prev, ...msg])
    } else {
      const tempMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      }
      const updated = [...localMessages, tempMsg]
      setLocalMessages(updated)
      localStorage.setItem(`anon-messages-${chatId}`, JSON.stringify(updated))
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta conversación?")) return
    try {
      await deleteConversation(id)
      // Opcional: si estás en la conversación eliminada, redirigir a /chat
      if (id === chatId) router.push("/chat")
    } catch (err) {
      console.error("Error al eliminar conversación:", err)
    }
  }

  if (authLoading) return <div>Cargando...</div>

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      <BackgroundIcons />

      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedConversationId={chatId}
        onSelectConversation={(id) => router.push(`/chat/${id}`)}
        onCreateConversation={() => {}}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={localMessages} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
