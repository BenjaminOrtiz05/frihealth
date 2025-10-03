import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(logs)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
