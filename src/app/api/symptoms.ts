import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import type { SymptomLog } from "@/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json([], { status: 200 })

  try {
    const logs = await prisma.symptomLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(logs)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Omit<SymptomLog, "id" | "createdAt"> = await req.json()
    if (!data.userId || !data.symptom) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const log = await prisma.symptomLog.create({ data })
    return NextResponse.json(log)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
