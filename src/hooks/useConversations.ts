"use client"

import { useState, useEffect, useCallback } from "react"
import type { Conversation } from "@/types"

export function useConversations(token?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Error al obtener conversaciones")
      const data: Conversation[] = await res.json()
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [token])

  const createConversation = useCallback(
    async (title?: string, firstMessage?: string): Promise<Conversation | null> => {
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
        const data: Conversation = await res.json()
        setConversations((prev) => [data, ...prev])
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        return null
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return { conversations, loading, error, fetchConversations, createConversation }
}
