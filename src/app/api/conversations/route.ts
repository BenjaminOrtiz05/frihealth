import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyAuth } from "@/lib/auth"

// ✅ Obtener todas las conversaciones del usuario
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(conversations)
  } catch (err) {
    console.error("Error al obtener conversaciones:", err)
    return NextResponse.json({ error: "Error al obtener conversaciones" }, { status: 500 })
  }
}

// ✅ Crear una nueva conversación
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const title = body.title || "Nueva conversación"

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title,
      },
    })

    return NextResponse.json(conversation)
  } catch (err) {
    console.error("Error al crear conversación:", err)
    return NextResponse.json({ error: "Error al crear conversación" }, { status: 500 })
  }
}
