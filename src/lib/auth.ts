import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db/prisma"

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.split(" ")[1]
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    // 🔹 Traer usuario completo desde la DB
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    return user // null si no existe
  } catch {
    return null
  }
}
