import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import type { MessagePayload } from "@/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get("conversationId")
  if (!conversationId) return NextResponse.json([], { status: 200 })

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(messages)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: MessagePayload = await req.json()
    if (!body.conversationId) return NextResponse.json({ error: "conversationId requerido" }, { status: 400 })

    const message = await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        sender: "user",
        content: body.content,
      },
    })
    return NextResponse.json(message)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
