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
  const { conversations } = useConversations(token ?? undefined)
  const { messages, sendMessage } = useMessages(chatId)

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    // Combina mensajes persistentes con los locales temporales
    setLocalMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id))
      const newMsgs = messages.filter((m) => !ids.has(m.id))
      return [...prev, ...newMsgs]
    })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    if (user) {
      const msg = await sendMessage(content)
      if (msg) setLocalMessages((prev) => [...prev, msg])
    } else {
      const tempMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      }
      setLocalMessages((prev) => [...prev, tempMsg])
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
      />

      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow messages={localMessages} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
