import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  // Generar posiciones aleatorias para los íconos
  const icons = Array.from({ length: 100 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
  }))

  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda con imagen */}
      <div className="hidden md:flex w-2/5 bg-blue-100 items-center justify-center">
        <img
          src="/banner-form.webp"
          alt="Ilustración de login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Columna derecha con formulario y patrón */}
      <div className="flex w-full md:w-3/5 items-center justify-center relative p-6 bg-gray-50">
        {/* Patrón de íconos aleatorio con un poquito más de opacidad */}
        <div className="absolute inset-0 pointer-events-none">
          {icons.map((pos, index) => (
            <img
              key={index}
              src="/pattern-health.svg"
              className="absolute w-4 h-4 opacity-20"
              style={{ top: pos.top, left: pos.left }}
              alt=""
            />
          ))}
        </div>

        {/* Flecha de volver */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </Link>

        {/* Formulario */}
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
      </div>
    </div>
  )
}
