"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import ChatHistoryCard from "./ChatHistoryCard"

export default function ChatSidebar() {

  const histories = [
    { title: "Consulta de fiebre", preview: "Hola, tengo fiebre desde ayer..." },
    { title: "Dolor de cabeza", preview: "Tengo dolor de cabeza desde hace dos días..." },
    { title: "Revisión general", preview: "Quisiera saber mis resultados de laboratorio..." },
  ]
  return (
    <aside className="w-72 h-full border-r bg-white/90 backdrop-blur-sm shadow-md flex flex-col">
      {/* Logo / título */}
      <div className="p-6 border-b flex items-center justify-center gap-2">
        <Bot className="w-6 h-6 text-blue-900" />
        <h1 className="text-2xl font-bold text-blue-900">FriHealth</h1>
      </div>

      {/* Historial de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {histories.map((h, idx) => (
          <ChatHistoryCard key={idx} title={h.title} preview={h.preview} />
        ))}
      </div>

      {/* Footer con botón */}
      <div className="p-6 border-t">
        <Link href="/profile">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Perfil
          </Button>
        </Link>
      </div>
    </aside>
  )
}
