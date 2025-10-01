import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db/prisma"

export async function getUserContext(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return { type: "anonymous", messages: [] }
  }

  try {
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
        conversations: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { messages: true },
        },
      },
    })

    if (!user) return { type: "anonymous", messages: [] }

    return { type: "registered", user }
  } catch {
    return { type: "anonymous", messages: [] }
  }
}
