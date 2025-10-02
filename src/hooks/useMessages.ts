"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChatMessage } from "@/types"

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data: ChatMessage[] = await res.json()
      if (!res.ok) throw new Error("Error al obtener mensajes")
      setMessages(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string): Promise<ChatMessage | null> => {
      if (!conversationId) return null
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, conversationId }),
        })
        const data: ChatMessage = await res.json()
        if (!res.ok) throw new Error("Error al enviar mensaje")
        setMessages((prev) => [...prev, data])
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [conversationId]
  )

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return { messages, loading, error, fetchMessages, sendMessage }
}
