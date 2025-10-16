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
    // Intentar verificar usuario
    const user = await verifyAuth(req).catch(() => null)
    const { conversationId, content, role } = await req.json()

    if (!content || !role)
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

    let activeConversationId = conversationId

    // 🔹 Si no hay conversación (usuario invitado), crear una temporal
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
        // Crear ID temporal en memoria (no persistente)
        activeConversationId = crypto.randomUUID()
      }
    }

    // 🔹 Guardar mensaje del usuario (si está logueado)
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

    // 🔹 Generar respuesta IA
    let aiText = "Lo siento, el servicio de IA no está disponible por ahora."
    try {
      aiText = await getAIResponse(content, {
        temperature: 0.5,
        maxTokens: 300,
        order: ["cohere", "huggingface", "gpt4all"],
      })
    } catch (error) {
      console.warn("⚠️ No se pudo generar respuesta de IA:", error)
    }

    // 🔹 Guardar respuesta del asistente
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

    // 🔹 Actualizar conversación (solo si usuario autenticado)
    if (user) {
      await prisma.conversation.update({
        where: { id: activeConversationId },
        data: { updatedAt: new Date() },
      })
    }

    // 🔹 Devolver ambos mensajes y la conversación
    return NextResponse.json({
      conversationId: activeConversationId,
      messages: [userMsg, aiMsg],
    })
  } catch (err) {
    console.error("Error al crear mensaje:", err)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
