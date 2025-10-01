import { prisma } from "../db/prisma"

export async function logAction(action: string, userId?: string, details?: string) {
  await prisma.auditLog.create({ data: { action, userId, details } })
}
