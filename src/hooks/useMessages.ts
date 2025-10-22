"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChatMessage } from "@/types"

export function useMessages(conversationId?: string, token?: string) {
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
      if (!conversationId) return null
      const tempUserMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        createdAt: new Date(),
      }

      // Mostrar mensaje del usuario de inmediato
      setMessages((prev) => [...prev, tempUserMsg])

      try {
        const res = await fetch(`/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content, conversationId, role }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Error al enviar mensaje")

        // 🔹 Siempre esperamos un array [userMsg, aiMsg]
        const newMessages: ChatMessage[] = Array.isArray(data)
          ? data
          : Array.isArray(data.messages)
          ? data.messages
          : [data]

        // ✅ Reemplazar mensaje temporal por los reales (user + ai)
        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== tempUserMsg.id),
          ...newMessages,
        ])

        return newMessages
      } catch (err) {
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

  return { messages, loading, error, fetchMessages, sendMessage }
}
