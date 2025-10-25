// src/app/(dashboard)/chat/[id]/page.tsx
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
  const { conversations, deleteConversation, updateLastMessage } = useConversations(token ?? undefined)
  const { messages, sendMessage } = useMessages(chatId, token ?? undefined)

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])

  // 🔹 Cargar mensajes anónimos desde localStorage
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem(`anon-messages-${chatId}`)
      if (saved) {
        setLocalMessages(JSON.parse(saved))
      } else {
        // Evita errores si no existe el array aún
        localStorage.setItem(`anon-messages-${chatId}`, JSON.stringify([]))
      }
    }
  }, [chatId, user])

  // 🔹 Sincronizar con mensajes del backend
  useEffect(() => {
    if (user) setLocalMessages(messages)
  }, [messages, user])

  // ✅ Enviar mensaje + mantener coherencia con conversación
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    if (user) {
      // Usuario autenticado
      const msg = await sendMessage(content)
      if (msg) {
        setLocalMessages((prev) => [...prev, ...msg])
        updateLastMessage(chatId, content)
      }
    } else {
      // Usuario anónimo
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: chatId,
            content,
            role: "user",
          }),
        })

        if (!res.ok) throw new Error("Error al enviar mensaje anónimo")

        const data = await res.json()

        // Añadir los mensajes del usuario y asistente al estado local
        setLocalMessages((prev) => [...prev, ...data.messages])

        // Guardar en localStorage para persistencia local
        localStorage.setItem(`anon-messages-${chatId}`, JSON.stringify([...localMessages, ...data.messages]))
      } catch (error) {
        console.error("Error al enviar mensaje anónimo:", error)
      }
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta conversación?")) return
    try {
      await deleteConversation(id)
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
