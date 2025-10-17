// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"
import { getAIResponse } from "@/lib/ai"

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId")
  if (!conversationId)
    return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(messages)
  } catch (err) {
    console.error("Error al obtener mensajes:", err)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Intentar obtener usuario; no aborta si no hay sesión
    const user = await verifyAuth(req).catch(() => null)
    const { conversationId, content, role } = await req.json()

    if (!content || !role)
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

    let activeConversationId = conversationId

    // 🔹 Crear conversación si no existe (solo persistente si hay usuario)
    if (!activeConversationId) {
      if (user) {
        const newConv = await prisma.conversation.create({
          data: {
            title: "Nueva conversación",
            userId: user.id,
          },
        })
        activeConversationId = newConv.id
      } else {
        activeConversationId = crypto.randomUUID()
      }
    }

    // 🔹 Construir userMsg (persistente solo si user)
    let userMsg = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      content,
      role,
      createdAt: new Date(),
    }

    if (user) {
      userMsg = await prisma.message.create({
        data: { conversationId: activeConversationId, content, role },
      })
    }

    // 🧩 Recuperar últimos mensajes para contexto (los más recientes)
    let recentMessages: { role: string; content: string }[] = []
    if (user) {
      const raw = await prisma.message.findMany({
        where: { conversationId: activeConversationId },
        orderBy: { createdAt: "desc" }, // tomar los últimos
        take: 8,
      })
      // revertimos para mantener orden cronológico ascendente
      recentMessages = raw.reverse().map((m) => ({
        role: m.role,
        content: m.content,
      }))
    }

    // 🔹 Generar respuesta IA con personalidad/contexto
    let aiText = "Lo siento, el servicio de IA no está disponible por ahora."
    try {
      aiText = await getAIResponse(content, {
        temperature: 0.5,
        maxTokens: 400,
        order: ["cohere", "huggingface", "gpt4all"],
        contextMessages: recentMessages,
      })
    } catch (error) {
      console.warn("⚠️ No se pudo generar respuesta de IA:", error)
    }

    // 🔹 Construir aiMsg (persistente solo si user)
    let aiMsg = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      content: aiText,
      role: "assistant",
      createdAt: new Date(),
    }

    if (user) {
      aiMsg = await prisma.message.create({
        data: {
          conversationId: activeConversationId,
          content: aiText,
          role: "assistant",
        },
      })
    }

    // 🔹 Actualizar fecha de conversación (si es persistente)
    if (user) {
      await prisma.conversation.update({
        where: { id: activeConversationId },
        data: { updatedAt: new Date() },
      })
    }

    // IMPORTANTE: devolver array [userMsg, aiMsg] -> compatibilidad frontend
    return NextResponse.json([userMsg, aiMsg])
  } catch (err) {
    console.error("Error al crear mensaje:", err)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
