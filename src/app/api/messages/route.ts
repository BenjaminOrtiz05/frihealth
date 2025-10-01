import { prisma } from "@/lib/db/prisma"
import type { Message } from "@prisma/client"
import { authMiddleware } from "@/app/middleware"
import { messageSchema } from "@/lib/validations"
import { NextRequest, NextResponse } from "next/server"
import type { ChatMessage } from "@/types"
import { buildPrompt } from "@/utils/prompts"
import { logAction } from "@/lib/utils/audit"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const conversationId = url.searchParams.get("conversationId")
  if (!conversationId)
    return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })

  const msgs: Message[] = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  })

  const history: ChatMessage[] = msgs.map((m: Message) => ({
    id: m.id,
    role: m.sender === "system" ? "assistant" : m.sender,
    content: m.content,
    createdAt: m.createdAt,
  }))

  return NextResponse.json(history)
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  const body = await req.json()
  const { content, conversationId } = messageSchema.parse(body)
  if (!conversationId)
    return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })

  // Crear mensaje del usuario
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      sender: auth.type === "registered" ? "user" : "anonymous",
      content,
    },
  })

  await logAction("Mensaje enviado", auth.userId, `Contenido: ${content}`)

  // Simulación respuesta asistente
  const assistantContent = "Respuesta simulada del asistente"
  const assistantMessage = await prisma.message.create({
    data: { conversationId, sender: "system", content: assistantContent },
  })

  await logAction("Mensaje asistente creado", auth.userId, `Contenido: ${assistantContent}`)

  return NextResponse.json({ userMessage, assistantMessage })
}
