/**
 * Punto de entrada unificado de IA
 * --------------------------------
 * Reexporta todos los módulos y fallback.
 * Ahora integra la personalidad médica desde `personality.ts`.
 */

import { getAIResponse as baseGetAIResponse } from "./fallback"
import { SYSTEM_PROMPT } from "./personality"

export { cohereResponse } from "./cohere"
export { huggingFaceResponse } from "./huggingface"
export { gpt4allResponse } from "./gpt4all"
export type { AIResponseOptions, FallbackOrder } from "./fallback"

/**
 * getAIResponse con personalidad médica y contexto de conversación
 */
export async function getAIResponse(
  message: string,
  options?: {
    temperature?: number
    maxTokens?: number
    order?: ("cohere" | "huggingface" | "gpt4all")[]
    contextMessages?: { role: string; content: string }[]
  }
) {
  // Unificamos contexto en un solo texto para mantener compatibilidad
  const contextText =
    (options?.contextMessages ?? [])
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n") || ""

  const fullPrompt = `
${SYSTEM_PROMPT}

${contextText}

USUARIO: ${message}
ASISTENTE:
  `

  return baseGetAIResponse(fullPrompt, {
    temperature: options?.temperature ?? 0.5,
    maxTokens: options?.maxTokens ?? 300,
    order: options?.order ?? ["cohere", "huggingface", "gpt4all"],
  })
}
