import { prisma } from "@/lib/db/prisma"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import { logAction } from "@/lib/utils/audit"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Hashear contraseña
    const hashed = await bcrypt.hash(data.password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: { email: data.email, passwordHash: hashed, name: data.name, role: "user" },
    })

    // Registrar acción de auditoría
    await logAction("Usuario registrado", user.id, `Email: ${user.email}`)

    // Crear JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    // Crear respuesta
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: "user" },
      token,
    })

    // Setear cookie httpOnly también aquí
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Error en registro"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
