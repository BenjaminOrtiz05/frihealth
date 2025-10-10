import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId")
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })
  }

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
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { conversationId, content, role } = await req.json()

    if (!conversationId || !content || !role) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (err) {
    console.error("Error al crear mensaje:", err)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
