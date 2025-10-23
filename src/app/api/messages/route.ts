// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"
import { getAIResponse } from "@/lib/ai"

/**
 * 🔹 GET → Obtener todos los mensajes de una conversación
 */
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
    console.error("❌ Error al obtener mensajes:", err)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

/**
 * 🔹 POST → Crear mensaje (usuario o asistente)
 * Maneja tanto usuarios autenticados como anónimos.
 */
export async function POST(req: NextRequest) {
  try {
    // Intentar obtener usuario autenticado (si existe)
    const user = await verifyAuth(req).catch(() => null)
    const { conversationId, content, role } = await req.json()

    if (!content || !role) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    let activeConversationId = conversationId
    const isAnonymous = !user

    /**
     * 🧩 Crear conversación si no existe
     * - Si hay usuario → guarda en BD con título dinámico.
     * - Si no hay usuario → genera UUID temporal.
     */
    if (!activeConversationId) {
      if (isAnonymous) {
        activeConversationId = crypto.randomUUID()
      } else {
        // Generar título breve basado en el primer mensaje
        const dynamicTitle =
          content.length > 40
            ? content.slice(0, 37).trim() + "..."
            : content.trim() || "Nueva conversación"

        const newConv = await prisma.conversation.create({
          data: {
            title: dynamicTitle,
            userId: user.id,
          },
        })
        activeConversationId = newConv.id
      }
    }

    /**
     * 💬 Crear mensaje del usuario (solo persistente si autenticado)
     */
    let userMsg = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      content,
      role,
      createdAt: new Date(),
    }

    if (!isAnonymous) {
      userMsg = await prisma.message.create({
        data: { conversationId: activeConversationId, content, role },
      })
    }

    /**
     * 🧠 Recuperar contexto reciente (solo si autenticado)
     */
    let recentMessages: { role: string; content: string }[] = []

    if (!isAnonymous) {
      const raw = await prisma.message.findMany({
        where: { conversationId: activeConversationId },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
      recentMessages = raw.reverse().map((m) => ({
        role: m.role,
        content: m.content,
      }))
    } else {
      // Si es anónimo, solo el mensaje actual sirve de contexto
      recentMessages = [{ role: "user", content }]
    }

    /**
     * 🤖 Generar respuesta de IA
     */
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

    /**
     * 💬 Crear mensaje del asistente (solo persistente si autenticado)
     */
    let aiMsg = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      content: aiText,
      role: "assistant",
      createdAt: new Date(),
    }

    if (!isAnonymous) {
      aiMsg = await prisma.message.create({
        data: { conversationId: activeConversationId, content: aiText, role: "assistant" },
      })

      // Actualizar timestamp de conversación
      await prisma.conversation.update({
        where: { id: activeConversationId },
        data: { updatedAt: new Date() },
      })
    }

    /**
     * ✅ Respuesta final al frontend
     */
    return NextResponse.json({
      conversationId: activeConversationId,
      messages: [userMsg, aiMsg],
    })
  } catch (err) {
    console.error("❌ Error al crear mensaje:", err)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
