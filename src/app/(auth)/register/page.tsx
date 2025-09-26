import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  // Array de colores posibles para los bordes
  const colors = ["#4ade80", "#22d3ee", "#facc15", "#f87171", "#a78bfa"]

  // Generar posiciones y colores aleatorios para los íconos
  const icons = Array.from({ length: 100 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda con imagen */}
      <div className="hidden md:flex w-2/5 bg-blue-100 items-center justify-center">
        <Image
          src="/fondo-registarse.jpg"
          alt="Ilustración de registro"
          width={400}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Columna derecha con formulario y patrón */}
      <div className="flex w-full md:w-3/5 items-center justify-center relative p-6 bg-gray-50">
        {/* Patrón de íconos aleatorio con color en el stroke */}
        <div className="absolute inset-0 pointer-events-none">
          {icons.map((icon, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className="absolute"
              style={{ top: icon.top, left: icon.left }}
            >
              <path
                d="M8 2v4M8 10v4M2 8h4M10 8h4"
                stroke={icon.color}
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          ))}
        </div>

        {/* Flecha de volver */}
        <Link
          href="/login"
          className="absolute top-6 left-6 flex items-center text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </Link>

        {/* Formulario */}
        <Card className="relative w-full max-w-md shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-blue-900">
              Crear cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" type="text" placeholder="Tu nombre" required />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" type="text" placeholder="Tu apellido" required />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="ejemplo@correo.com" required />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
