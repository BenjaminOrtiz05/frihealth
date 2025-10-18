// src/hooks/useConversations.ts
"use client"

import { useState, useEffect, useCallback } from "react"

export type ConversationPreview = {
  id: string
  title: string
  lastMessage: string
  updatedAt: string | Date
}

export function useConversations(token?: string) {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations/with-last-message", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Error al obtener conversaciones")
      const data: ConversationPreview[] = await res.json()
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [token])

  // 🔹 Actualiza dinámicamente el último mensaje (solo del usuario)
  const updateLastMessage = useCallback(
    (conversationId: string, newMessage: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, lastMessage: newMessage } : conv
        )
      )
    },
    []
  )

  const createConversation = useCallback(
    async (title?: string, firstMessage?: string): Promise<ConversationPreview | null> => {
      if (!token) return null
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, firstMessage }),
        })
        if (!res.ok) throw new Error("Error al crear conversación")
        const created = await res.json()

        const preview = {
          id: created.id,
          title: created.title ?? `Conversación ${created.id.slice(0, 6)}`,
          lastMessage: created.messages?.[0]?.content ?? (firstMessage ?? "Sin mensajes aún"),
          updatedAt: created.updatedAt,
        } as ConversationPreview

        setConversations((prev) => [preview, ...prev])
        return preview
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        return null
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  // 🔹 Refresca el historial automáticamente cada 30 segundos (por si hay otra pestaña)
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(() => fetchConversations(), 30000)
    return () => clearInterval(interval)
  }, [fetchConversations])

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    updateLastMessage, // <-- Añadido
  }
}
