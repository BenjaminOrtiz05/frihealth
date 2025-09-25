import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Lock, ArrowLeft } from "lucide-react"

export default function RecoverPasswordPage() {
  const colors = ["#4ade80", "#22d3ee", "#facc15", "#f87171", "#a78bfa"]

  const icons = Array.from({ length: 50 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 relative p-6">
      {/* Patrón de íconos aleatorio */}
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

      {/* Botón de volver */}
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center text-blue-900 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Volver</span>
      </Link>

      {/* Card central */}
      <Card className="relative w-full max-w-lg shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm text-center p-10">
        <div className="flex flex-col items-center space-y-4">
          {/* Icono */}
          <Lock className="w-12 h-12 text-blue-500" />

          {/* Título */}
          <h2 className="text-2xl font-semibold text-blue-900">Recuperar contraseña</h2>

          {/* Texto explicativo */}
          <p className="text-gray-700">
            Para recuperar tu contraseña, por favor contacta al equipo de Soporte Técnico.
          </p>

          {/* Botón de correo */}
          <a
            href="mailto:soporte@tusitio.com"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md inline-block text-center"
          >
            Contactar Soporte
          </a>
        </div>
      </Card>
    </div>
  )
}
