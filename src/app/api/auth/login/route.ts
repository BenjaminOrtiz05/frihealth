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
    if (!user)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    // Verificar contraseña
    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

    // Registrar acción de auditoría
    await logAction("Usuario login", user.id)

    // Crear JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    // Crear response
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })

    // Setear cookie segura
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    return response
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Error en login"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
