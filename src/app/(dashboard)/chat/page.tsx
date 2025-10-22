"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"
import BackgroundIcons from "@/components/BackgroundIcons"
import { useAuth } from "@/hooks/useAuth"
import { useConversations } from "@/hooks/useConversations"

export default function ChatPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const { conversations, createConversation, deleteConversation } = useConversations(token ?? undefined)
  const [isCreating, setIsCreating] = useState(false)

  const handleStartConversation = async (content: string) => {
    if (!content.trim() || isCreating) return
    setIsCreating(true)

    try {
      let conversationId: string

      if (user) {
        // ✅ Crear conversación y enviar el mensaje inicial en el backend
        const newConv = await createConversation(undefined, content)
        if (!newConv?.id) throw new Error("No se pudo crear la conversación")
        conversationId = newConv.id
      } else {
        // 🔹 Usuario anónimo
        conversationId = crypto.randomUUID()
        localStorage.setItem(
          `anon-messages-${conversationId}`,
          JSON.stringify([
            { id: crypto.randomUUID(), role: "user", content, createdAt: new Date() },
          ])
        )
      }

      // ✅ Redirigir al chat recién creado sin volver a enviar el mensaje
      router.replace(`/chat/${conversationId}?firstSent=true`)
    } catch (error) {
      console.error("Error al iniciar conversación:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta conversación?")) return
    try {
      await deleteConversation(id)
    } catch (err) {
      console.error("Error al eliminar conversación:", err)
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      <BackgroundIcons />

      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedConversationId={null}
        onSelectConversation={(id) => router.push(`/chat/${id}`)}
        onCreateConversation={() => {}}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={[]} />

        <div className="relative">
          <ChatInput onSend={handleStartConversation} disabled={isCreating} />
          {isCreating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
              <span className="text-sm text-gray-700 animate-pulse">Creando conversación...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
