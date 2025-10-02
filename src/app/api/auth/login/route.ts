import { prisma } from "@/lib/db/prisma"
import { loginSchema } from "@/lib/validations"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import { logAction } from "@/lib/utils/audit"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = loginSchema.parse(body)

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    // Verificar contraseña
    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

    // Registrar acción de auditoría
    await logAction("Usuario login", user.id)

    // Crear JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token })
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Error en login"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
