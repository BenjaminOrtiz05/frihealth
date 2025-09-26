"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export default function ChatSidebar() {
  return (
    <aside className="w-72 h-full border-r bg-white/90 backdrop-blur-sm shadow-md flex flex-col">
      {/* Logo / título */}
      <div className="p-6 border-b flex items-center justify-center gap-2">
        <Bot className="w-6 h-6 text-blue-900" />
        <h1 className="text-2xl font-bold text-blue-900">FriHealth</h1>
      </div>

      {/* Aviso central */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full bg-white/90 border border-gray-200 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-center text-lg font-semibold text-blue-900">
              Historial no disponible
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-700">
            Para obtener la función de historial de conversación debes{" "}
            <Link href="/login" className="text-blue-700 hover:underline font-medium">
              iniciar sesión
            </Link>{" "}
            o{" "}
            <Link href="/register" className="text-blue-700 hover:underline font-medium">
              registrarte
            </Link>.
          </CardContent>
        </Card>
      </div>

      {/* Footer con botón */}
      <div className="p-6 border-t">
        <Link href="/login">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </aside>
  )
}
