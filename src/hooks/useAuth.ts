"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/types"
import { toast } from "sonner"

interface AuthResponse {
  user: User
  token?: string
  error?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener usuario desde localStorage (si existe token)
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en login")

      setUser(data.user)
      localStorage.setItem("token", data.token!)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Inicio de sesión exitoso 🎉")
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data: AuthResponse = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en registro")

      setUser(data.user)
      localStorage.setItem("token", data.token!)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Registro exitoso 🎉")
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.info("Sesión cerrada")
  }, [])

  return { user, loading, error, login, register, logout }
}
