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
    setLoading(true)
    setError(null)

    const tempMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date(),
    }

    // Mostrar mensaje inmediatamente
    setMessages((prev) => [...prev, tempMessage])

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

      // 🔹 Ajustar al nuevo formato del backend
      const newMessages: ChatMessage[] = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
        ? data.messages
        : [data]

      // Reemplaza el mensaje temporal y agrega los nuevos
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== tempMessage.id),
        ...newMessages,
      ])

      return newMessages
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      return null
    } finally {
      setLoading(false)
    }
  },
  [conversationId, token]
)

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return { messages, loading, error, fetchMessages, sendMessage }
}
