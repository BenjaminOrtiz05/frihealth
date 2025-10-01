"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import type { Conversation } from "@/types"

interface ChatSidebarProps {
  user: { id: string; name?: string } | null
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  onCreateConversation: () => void
}

export default function ChatSidebar({
  user,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
}: ChatSidebarProps) {
  return (
    <aside className="w-72 h-full border-r bg-white/90 backdrop-blur-sm shadow-md flex flex-col">
      {/* Logo / título */}
      <div className="p-6 border-b flex items-center justify-center gap-2">
        <Bot className="w-6 h-6 text-blue-900" />
        <h1 className="text-2xl font-bold text-blue-900">FriHealth</h1>
      </div>

      {/* Contenido condicional */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 space-y-4 overflow-y-auto">
        {!user ? (
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
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={conv.id === selectedConversationId ? "default" : "outline"}
              className="w-full text-left"
              onClick={() => onSelectConversation(conv.id)}
            >
              Conversación {conv.id.slice(0, 6)}
            </Button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t w-full">
        {!user ? (
          <Link href="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Iniciar sesión
            </Button>
          </Link>
        ) : (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onCreateConversation}
          >
            Nueva conversación
          </Button>
        )}
      </div>
    </aside>
  )
}
