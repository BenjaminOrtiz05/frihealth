import { useState, useEffect } from "react"
import type { Conversation } from "@/types"

export function useConversations(userId?: string) { // <-- ahora acepta opcionalmente userId
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = async () => {
    if (!userId) return // si no hay usuario, no hace fetch
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener conversaciones")
      setConversations(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async () => {
    if (!userId) return null // mismo control
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al crear conversación")
      setConversations((prev) => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [userId]) // se ejecuta cuando cambia el userId

  return { conversations, loading, error, fetchConversations, createConversation }
}
