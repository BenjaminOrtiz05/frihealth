import { z } from "zod"

// Validación de registro de usuario
export const registerSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  name: z.string().optional(),
})

// Validación de login
export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

// Validación de mensaje
export const messageSchema = z.object({
  content: z.string().min(1, { message: "El mensaje no puede estar vacío" }),
  conversationId: z.string().optional(),
})

// Validación de conversación
export const conversationSchema = z.object({
  title: z.string().optional(),
})

// Validación de registro de síntomas
export const symptomSchema = z.object({
  symptom: z.string().min(1, { message: "Síntoma requerido" }),
  severity: z.number().min(1).max(5),
  notes: z.string().optional(),
})
