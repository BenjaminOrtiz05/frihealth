"use client"

import { useState, useEffect, useCallback } from "react"
import type { Conversation } from "@/types"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations")
      const data: Conversation[] = await res.json()
      if (!res.ok) throw new Error("Error al obtener conversaciones")
      setConversations(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createConversation = useCallback(async (): Promise<Conversation | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations", { method: "POST" })
      const data: Conversation = await res.json()
      if (!res.ok) throw new Error("Error al crear conversación")
      setConversations((prev) => [data, ...prev])
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return { conversations, loading, error, fetchConversations, createConversation }
}
