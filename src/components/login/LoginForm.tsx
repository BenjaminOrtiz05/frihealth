"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      router.push("/chat")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative w-full max-w-md shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-blue-900">
          Iniciar sesión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mt-4 flex justify-between text-sm text-blue-600">
          <a href="/reset" className="hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="/register" className="hover:underline">
            Crear cuenta
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
