"use client"

import { useState, useEffect, useCallback } from "react"
import type { SymptomLog } from "@/types"

export function useSymptoms(userId?: string) {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSymptoms = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/symptoms?userId=${userId}`)
      const data: SymptomLog[] = await res.json()
      if (!res.ok) throw new Error("Error al obtener síntomas")
      setSymptoms(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const logSymptom = useCallback(
    async (symptom: Omit<SymptomLog, "id" | "userId" | "createdAt">): Promise<SymptomLog | null> => {
      if (!userId) return null
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/symptoms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...symptom, userId }),
        })
        const data: SymptomLog = await res.json()
        if (!res.ok) throw new Error("Error al registrar síntoma")
        setSymptoms((prev) => [...prev, data])
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  useEffect(() => {
    fetchSymptoms()
  }, [fetchSymptoms])

  return { symptoms, loading, error, fetchSymptoms, logSymptom }
}
