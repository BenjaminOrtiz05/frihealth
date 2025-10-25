"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChatMessage } from "@/types"

export function useMessages(initialConversationId?: string, token?: string) {
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data: ChatMessage[] = await res.json()
      if (!res.ok) throw new Error("Error al obtener mensajes")
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [conversationId, token])

  const sendMessage = useCallback(
    async (content: string, role: "user" | "assistant" = "user") => {
      if (!content.trim()) return null

      // 🔹 Mensaje temporal del usuario (feedback inmediato)
      const tempUserMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, tempUserMsg])

      try {
        const res = await fetch(`/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            content,
            conversationId: conversationId || null,
            role,
          }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Error al enviar mensaje")

        // ✅ Si el backend devuelve un nuevo conversationId (usuario anónimo)
        if (!conversationId && data.conversationId) {
          setConversationId(data.conversationId)
        }

        // 🔹 Siempre esperamos un array [userMsg, aiMsg]
        const newMessages: ChatMessage[] = Array.isArray(data.messages)
          ? data.messages
          : Array.isArray(data)
          ? data
          : [data]

        // ✅ Reemplaza el mensaje temporal con los reales (user + AI)
        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== tempUserMsg.id),
          ...newMessages,
        ])

        return newMessages
      } catch (err) {
        console.error("❌ Error al enviar mensaje:", err)
        setError(err instanceof Error ? err.message : String(err))
        // Revertir mensaje temporal si falla
        setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMsg.id))
        return null
      }
    },
    [conversationId, token]
  )

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return {
    conversationId,
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  }
}
