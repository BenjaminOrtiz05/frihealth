import { useState, useEffect } from "react"
import type { SymptomLog } from "@/types"

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSymptoms = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/symptoms")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener síntomas")
      setSymptoms(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const registerSymptom = async (symptom: string, severity: number, notes?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom, severity, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al registrar síntoma")
      setSymptoms((prev) => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSymptoms()
  }, [])

  return { symptoms, loading, error, fetchSymptoms, registerSymptom }
}
