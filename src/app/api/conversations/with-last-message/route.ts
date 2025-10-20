// src/app/api/conversations/with-last-message/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"

/**
 * Devuelve las conversaciones del usuario con el último mensaje (solo del usuario).
 */
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          where: { role: "user" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true },
        },
      },
    })

    const result = conversations.map((c) => ({
      id: c.id,
      title: c.title ?? `Conversación ${c.id.slice(0, 6)}`,
      lastMessage: c.messages?.[0]?.content ?? "Sin mensajes aún",
      updatedAt: c.updatedAt,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Error al obtener conversaciones con preview:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
