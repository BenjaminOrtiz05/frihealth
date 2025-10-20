// src/components/chat/ChatSidebar.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import ChatCard from "@/components/chat/ChatHistoryCard"
import type { ConversationPreview } from "@/types"
import type { User } from "@/types"

interface ChatSidebarProps {
  user: User | null
  conversations: ConversationPreview[]
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  onCreateConversation: () => void
  onDeleteConversation: (id: string) => void
}

export default function ChatSidebar({
  user,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const router = useRouter()

  const handleNewConversation = () => {
    onCreateConversation()
    router.push("/chat") // Redirige al usuario a /chat
  }

  return (
    <aside className="w-72 h-full border-r bg-white/90 backdrop-blur-sm shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-900" />
          <h1 className="text-2xl font-bold text-blue-900">FriHealth</h1>
        </div>
      </div>

      {/* Botón: Nueva conversación */}
      {user && (
        <div className="p-4 border-b flex justify-center">
          <Button
            onClick={handleNewConversation}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all"
          >
            Nueva conversación
          </Button>
        </div>
      )}

      {/* Contenido central (Historial) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {!user ? (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full bg-white/90 border border-gray-200 shadow-md rounded-xl max-w-sm">
              <CardHeader>
                <CardTitle className="text-center text-lg font-semibold text-blue-900">
                  Historial no disponible
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-700">
                Para acceder a tu historial debes{" "}
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
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => {
            const title = conv.title || `Conversación ${conv.id.slice(0, 6)}`
            const preview = conv.lastMessage || "Sin mensajes aún"

            return (
              <div
                key={`conv-${conv.id}`}
                className={`cursor-pointer transition-all ${
                  conv.id === selectedConversationId ? "ring-2 ring-emerald-200 rounded-md" : ""
                }`}
              >
                <ChatCard
                  title={title}
                  preview={preview}
                  conversationId={conv.id}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onSelect={() => onSelectConversation(conv.id)}
                />
              </div>
            )
          })
        ) : (
          <p className="text-sm text-gray-600 text-center mt-6">
            No hay conversaciones recientes
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        {!user ? (
          <Link href="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Iniciar sesión
            </Button>
          </Link>
        ) : (
          <Link href="/profile">
            <Button className="w-full bg-blue-900 hover:bg-blue-950 text-white rounded-xl transition-all">
              Ver Perfil
            </Button>
          </Link>
        )}
      </div>
    </aside>
  )
}
