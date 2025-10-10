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
  const [token, setToken] = useState<string | null>(null) // ✅ nuevo
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener usuario y token desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
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
      setToken(data.token ?? null) // ✅ almacenar token
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
      setToken(data.token ?? null) // ✅ almacenar token
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
    setToken(null) // ✅ limpiar token
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.info("Sesión cerrada")
  }, [])

  return { user, token, loading, error, login, register, logout } // ✅ retornar token
}
