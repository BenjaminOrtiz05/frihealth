import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db/prisma"
import { registerSchema, loginSchema } from "@/lib/validations"
import { logAction } from "@/lib/utils/audit"

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const action = url.pathname.split("/").pop() // login o register

  try {
    const body = await req.json()

    if (action === "register") {
      const data = registerSchema.parse(body)
      const hashed = await bcrypt.hash(data.password, 10)

      const user = await prisma.user.create({
        data: { email: data.email, passwordHash: hashed, name: data.name },
      })

      await logAction("Usuario registrado", user.id, `Email: ${user.email}`)

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" })
      return NextResponse.json({ user, token })
    }

    if (action === "login") {
      const data = loginSchema.parse(body)
      const user = await prisma.user.findUnique({ where: { email: data.email } })
      if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

      const valid = await bcrypt.compare(data.password, user.passwordHash)
      if (!valid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

      await logAction("Usuario login", user.id)

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" })
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token })
    }

    return NextResponse.json({ error: "Ruta no válida" }, { status: 404 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
