"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"

export default function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado "tocado" para cada input
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  })

  // Validaciones locales
  const isEmailValid = /\S+@\S+\.\S+/.test(email)
  const isPasswordValid = password.length >= 6
  const isFirstNameValid = firstName.trim().length > 0
  const isLastNameValid = lastName.trim().length > 0
  const isFormValid = isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Marcar todos como tocados para mostrar errores si se intenta enviar sin tocar
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    })

    if (!isFormValid) {
      setError("Por favor corrige los campos marcados antes de continuar")
      return
    }

    setLoading(true)
    try {
      await register(email, password, `${firstName} ${lastName}`)
      router.push("/chat")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error al crear la cuenta")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative w-full max-w-md shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-blue-900">
          Crear cuenta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Tu nombre"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
              className={touched.firstName && !isFirstNameValid ? "border-red-500" : ""}
            />
          </div>

          {/* Apellido */}
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Tu apellido"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
              className={touched.lastName && !isLastNameValid ? "border-red-500" : ""}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={touched.email && !isEmailValid ? "border-red-500" : ""}
            />
          </div>

          {/* Contraseña con tooltip y show/hide */}
          <div className="flex items-center gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-red-600 font-bold cursor-help">!</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>La contraseña debe ser igual o mayor a 6 dígitos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              minLength={6}
              className={touched.password && !isPasswordValid ? "border-red-500" : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrar"}
          </Button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
