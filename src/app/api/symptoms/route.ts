import { prisma } from "@/lib/db/prisma"
import { NextRequest, NextResponse } from "next/server"
import { authMiddleware } from "@/app/middleware"
import { z } from "zod"
import { logAction } from "@/lib/utils/audit"

const symptomSchema = z.object({
  symptom: z.string().min(1),
  severity: z.number().min(1).max(5),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth.type !== "registered")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const logs = await prisma.symptomLog.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth.type !== "registered")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { symptom, severity, notes } = symptomSchema.parse(body)

  const log = await prisma.symptomLog.create({
    data: { userId: auth.userId!, symptom, severity, notes },
  })

  await logAction(
    "Síntoma registrado",
    auth.userId,
    `Síntoma: ${symptom}, Severidad: ${severity}`
  )

  return NextResponse.json(log)
}
