// src/hooks/useConversations.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import type { ConversationPreview } from "@/types"

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

  // 🔹 Generador rápido de títulos
  const generateTitleFromMessage = (message: string): string => {
    if (!message) return "Nueva conversación"
    // Limpia caracteres raros, reduce longitud y genera resumen simple
    const cleaned = message
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim()

    // Toma las primeras 6-8 palabras máximo
    const words = cleaned.split(" ").slice(0, 8).join(" ")
    const title =
      words.length > 0
        ? words.charAt(0).toUpperCase() + words.slice(1) + (cleaned.split(" ").length > 8 ? "..." : "")
        : "Nueva conversación"

    return title
  }

  // 🔹 Crear conversación con título automático
  const createConversation = useCallback(
    async (title?: string, firstMessage?: string): Promise<ConversationPreview | null> => {
      if (!token) return null
      setLoading(true)
      setError(null)
      try {
        // Generar título basado en mensaje, si no hay uno
        const generatedTitle = title && title !== "Nueva conversación"
          ? title
          : generateTitleFromMessage(firstMessage ?? "")

        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: generatedTitle,
            firstMessage,
          }),
        })

        if (!res.ok) throw new Error("Error al crear conversación")
        const created = await res.json()

        const preview: ConversationPreview = {
          id: created.id,
          title: created.title ?? generatedTitle,
          lastMessage:
            created.messages?.[0]?.content ?? firstMessage ?? "Sin mensajes aún",
          updatedAt: created.updatedAt,
        }

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

  const updateLastMessage = useCallback(
    (conversationId: string, newMessage: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
            : conv
        )
      )
    },
    []
  )

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!token) return false
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/conversations", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId }),
        })

        if (!res.ok) throw new Error("Error al eliminar conversación")
        setConversations((prev) => prev.filter((c) => c.id !== conversationId))
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        return false
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

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
    updateLastMessage,
    deleteConversation,
  }
}
