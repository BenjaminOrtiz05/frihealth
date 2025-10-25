// src/lib/ai/index.ts
/**
 * Punto de entrada unificado de IA
 * --------------------------------
 * Reexporta módulos específicos y expone getAIResponse con la
 * personalidad médica (SYSTEM_PROMPT).
 */

import { getAIResponse as baseGetAIResponse } from "./fallback"
import { SYSTEM_PROMPT } from "./personality"

export { cohereResponse } from "./cohere"
export { huggingFaceResponse } from "./huggingface"
export { gpt4allResponse } from "./gpt4all"
export type { AIResponseOptions, FallbackOrder } from "./fallback"

type AllowedRole = "user" | "assistant" | "system"

interface ContextMessage {
  role: AllowedRole
  content: string
}

/**
 * Opciones públicas que acepta la función.
 * contextMessages puede venir con role: string (por compatibilidad),
 * lo normalizamos internamente.
 */
interface AIOptions {
  temperature?: number
  maxTokens?: number
  order?: ("cohere" | "huggingface" | "gpt4all")[]
  // permitimos que callers pasen role: string — lo normalizaremos
  contextMessages?: { role: string; content: string }[]
}

/**
 * Normaliza role strings a AllowedRole; cualquier valor inesperado -> "user"
 */
function normalizeContextMessages(
  input?: { role: string; content: string }[]
): ContextMessage[] {
  if (!input || !Array.isArray(input)) return []
  const allowed: AllowedRole[] = ["user", "assistant", "system"]
  return input.map((m) => {
    const r = typeof m.role === "string" && allowed.includes(m.role as AllowedRole)
      ? (m.role as AllowedRole)
      : "user"
    return { role: r, content: String(m.content ?? "") }
  })
}

/**
 * getAIResponse con personalidad médica y contexto de conversación
 */
export async function getAIResponse(
  message: string,
  options: AIOptions = {}
): Promise<string> {
  // Normalizamos/validamos cualquier contexto que venga del caller
  const contextMessages = normalizeContextMessages(options.contextMessages)

  // Construimos un bloque de texto con el contexto (si existe)
  const contextText = contextMessages.length
    ? contextMessages.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")
    : ""

  // Formato final del prompt — limpio, sin duplicaciones
  const prompt = `
${SYSTEM_PROMPT}

${contextText ? contextText + "\n" : ""}USUARIO: ${message}
ASISTENTE:
`

  try {
    const response = await baseGetAIResponse(prompt, {
      temperature: options.temperature ?? 0.5,
      maxTokens: options.maxTokens ?? 300,
      order: options.order ?? ["cohere", "huggingface", "gpt4all"],
    })

    return String(response).trim()
  } catch (err) {
    console.error("⚠️ Error en getAIResponse:", err)
    // Devolvemos un texto seguro y útil para el usuario en caso de fallo
    return "Lo siento, no pude procesar tu consulta en este momento. ¿Puedes intentarlo de nuevo?"
  }
}
