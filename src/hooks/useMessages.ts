import { useState, useEffect } from "react"
import type { ChatMessage } from "@/types"

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    if (!conversationId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener mensajes")
      setMessages(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!conversationId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, conversationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al enviar mensaje")
      // Actualiza historial local
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [conversationId])

  return { messages, loading, error, fetchMessages, sendMessage }
}
