// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"

// 🔹 Obtener todas las conversaciones del usuario
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { messages: true },
    })

    return NextResponse.json(conversations)
  } catch (err) {
    console.error("Error al obtener conversaciones:", err)
    return NextResponse.json({ error: "Error al obtener conversaciones" }, { status: 500 })
  }
}

// 🔹 Crear una nueva conversación con mensaje inicial opcional
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const title = body.title || "Nueva conversación"
    const firstMessage = body.firstMessage

    // ✅ Crear conversación
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title,
      },
    })

    let userMsg = null
    let aiMsg = null

    // ✅ Si hay mensaje inicial, crearlo y generar respuesta del asistente
    if (firstMessage) {
      userMsg = await prisma.message.create({
        data: { conversationId: conversation.id, role: "user", content: firstMessage },
      })

      // 🧠 Generar respuesta IA usando la misma lógica que en /api/messages
      let aiText = "Lo siento, el servicio de IA no está disponible por ahora."
      try {
        const { getAIResponse } = await import("@/lib/ai")
        aiText = await getAIResponse(firstMessage, {
          temperature: 0.5,
          maxTokens: 400,
          order: ["cohere", "huggingface", "gpt4all"],
          contextMessages: [{ role: "user", content: firstMessage }],
        })
      } catch (err) {
        console.warn("⚠️ No se pudo generar respuesta inicial de IA:", err)
      }

      aiMsg = await prisma.message.create({
        data: { conversationId: conversation.id, role: "assistant", content: aiText },
      })

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })
    }

    // ✅ Retornar conversación con ambos mensajes (si existen)
    return NextResponse.json({
      ...conversation,
      messages: [userMsg, aiMsg].filter(Boolean),
    })
  } catch (err) {
    console.error("Error al crear conversación:", err)
    return NextResponse.json({ error: "Error al crear conversación" }, { status: 500 })
  }
}

// 🔹 Eliminar una conversación (y sus mensajes asociados)
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { conversationId } = await req.json()
    if (!conversationId) {
      return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation || conversation.userId !== user.id) {
      return NextResponse.json({ error: "No autorizado o conversación no encontrada" }, { status: 403 })
    }

    // 🔸 Eliminar mensajes y conversación
    await prisma.message.deleteMany({ where: { conversationId } })
    await prisma.conversation.delete({ where: { id: conversationId } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error al eliminar conversación:", err)
    return NextResponse.json({ error: "Error al eliminar conversación" }, { status: 500 })
  }
}
