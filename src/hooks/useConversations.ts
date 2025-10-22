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

  // 🔹 Generador rápido de títulos (sin usar \p{L} para evitar flags TS)
  const generateTitleFromMessage = (message: string): string => {
    if (!message) return "Nueva conversación"
    // Sustituir múltiples espacios, eliminar caracteres no alfanuméricos básicos (mantenemos acentos si tu fuente los soporta)
    const cleaned = message
      .replace(/\s+/g, " ")
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, "")
      .trim()

    // Tomar hasta 5 palabras para un título corto
    const words = cleaned.split(" ").slice(0, 5).join(" ")
    const title =
      words.length > 0
        ? words.charAt(0).toUpperCase() + words.slice(1) + (cleaned.split(" ").length > 5 ? "..." : "")
        : "Nueva conversación"

    return title
  }

  // 🔹 Crear conversación con título automático (si no se pasa title)
  const createConversation = useCallback(
    async (title?: string, firstMessage?: string): Promise<ConversationPreview | null> => {
      if (!token) return null
      setLoading(true)
      setError(null)
      try {
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

        if (!res.ok) {
          const body = await res.text().catch(() => null)
          throw new Error(`Error al crear conversación: ${body ?? res.statusText}`)
        }

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
        if (!res.ok) {
          const body = await res.text().catch(() => null)
          throw new Error(`Error al eliminar conversación: ${body ?? res.statusText}`)
        }
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
