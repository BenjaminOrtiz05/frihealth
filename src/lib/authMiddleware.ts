// src/lib/authMiddleware.ts
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthContext {
  type: "anonymous" | "registered"
  userId?: string
}

export async function authMiddleware(req: NextRequest): Promise<AuthContext> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { type: "anonymous" }
  }

  try {
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    return { type: "registered", userId: decoded.id }
  } catch {
    return { type: "anonymous" }
  }
}
