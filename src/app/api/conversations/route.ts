import { prisma } from "@/lib/db/prisma"
import { NextRequest, NextResponse } from "next/server"
import { authMiddleware } from "@/app/middleware"
import { logAction } from "@/lib/utils/audit"

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth.type !== "registered")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const conversations = await prisma.conversation.findMany({
    where: { userId: auth.userId },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(conversations)
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth.type !== "registered")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const conversation = await prisma.conversation.create({
    data: { userId: auth.userId! },
  })

  await logAction("Conversación creada", auth.userId, `ID: ${conversation.id}`)

  return NextResponse.json(conversation)
}
