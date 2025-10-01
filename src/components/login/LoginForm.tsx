"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  return (
    <Card className="relative w-full max-w-md shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-blue-900">
          Iniciar sesión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Ingresar
          </Button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-blue-600">
          <Link href="/reset" className="hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link href="/register" className="hover:underline">
            Crear cuenta
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
