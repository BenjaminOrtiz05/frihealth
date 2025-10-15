/**
 * Fallback entre modelos de IA (Cohere → Hugging Face → GPT4All)
 * --------------------------------------------------------------
 * - Devuelve la primera respuesta válida.
 * - Maneja errores, tiempos de espera y registro básico.
 * - Compatible con Next.js / TypeScript / ESLint.
 */

import { cohereResponse } from "./cohere"
import { huggingFaceResponse } from "./huggingface"
import { gpt4allResponse } from "./gpt4all"

export type FallbackOrder = Array<"cohere" | "huggingface" | "gpt4all">

export interface AIResponseOptions {
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
  retries?: number
  order?: FallbackOrder
}

/**
 * Lógica de fallback entre modelos.
 * Intenta cada uno según el orden configurado hasta lograr respuesta.
 */
export async function getAIResponse(
  prompt: string,
  opts: AIResponseOptions = {}
): Promise<string> {
  if (!prompt.trim()) throw new Error("Prompt vacío")

  const order: FallbackOrder = opts.order || ["cohere", "huggingface", "gpt4all"]
  const errors: string[] = []

  for (const model of order) {
    try {
      switch (model) {
        case "cohere":
          return await cohereResponse(prompt, opts)
        case "huggingface":
          return await huggingFaceResponse(prompt, opts)
        case "gpt4all":
          return await gpt4allResponse(prompt, opts)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(`[${model}] ${message}`)
      console.warn(`⚠️ Error en ${model}: ${message}`)
    }
  }

  throw new Error(`❌ Fallaron todos los modelos:\n${errors.join("\n")}`)
}
