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
    const user = await verifyAuth(req)
      if (!user) return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
    const { conversationId, content, role } = await req.json()

    if (!conversationId || !content || !role)
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

    // 🔹 Guardar mensaje del usuario
    const userMsg = await prisma.message.create({
      data: { conversationId, content, role },
    })

    // 🔹 Actualizar conversación
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    // 🔹 Llamar a la IA con fallback
    const aiText = await getAIResponse(content, {
      temperature: 0.5,
      maxTokens: 300,
      order: ["cohere", "huggingface", "gpt4all"],
    })

    // 🔹 Guardar respuesta del asistente
    const aiMsg = await prisma.message.create({
      data: {
        conversationId,
        content: aiText,
        role: "assistant",
      },
    })

    return NextResponse.json([userMsg, aiMsg])
  } catch (err) {
    console.error("Error al crear mensaje:", err)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
