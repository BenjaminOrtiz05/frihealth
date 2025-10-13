/**
 * Cohere AI v7.19.0
 * Compatible con fallback
 * Usa CohereClientV2
 */

import { CohereClientV2 } from "cohere-ai"

type CohereOpts = {
  model?: string
  temperature?: number
  maxTokens?: number
  retries?: number
  timeoutMs?: number
}

const COHERE_KEY = process.env.COHERE_API_KEY
const DEFAULT_MODEL = process.env.COHERE_MODEL || "command-r-plus"
const DEFAULT_TIMEOUT = Number(process.env.COHERE_TIMEOUT_MS || "10000")
const DEFAULT_RETRIES = Number(process.env.COHERE_MAX_RETRIES || "2")

// Inicialización segura del cliente
const client = COHERE_KEY ? new CohereClientV2({ token: COHERE_KEY }) : null

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

/** Timeout wrapper */
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout tras ${ms}ms`)), ms)
  })
  try {
    const result = await Promise.race([promise, timeout])
    return result as T
  } finally {
    clearTimeout(timeoutId!)
  }
}

/**
 * Genera respuesta de Cohere
 */
export async function cohereResponse(
  prompt: string,
  opts: CohereOpts = {}
): Promise<string> {
  if (!COHERE_KEY || !client) throw new Error("COHERE_API_KEY no configurada")
  if (!prompt.trim()) throw new Error("Prompt vacío")

  const model = opts.model || DEFAULT_MODEL
  const temperature = opts.temperature ?? 0.3
  const maxTokens = opts.maxTokens ?? 300
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const retries = opts.retries ?? DEFAULT_RETRIES

  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      attempt++

      // Llamada a la API de Cohere
      const response = await withTimeout(
        client.generate({
          model,
          prompt,
          maxTokens: maxTokens,
          temperature,
          k: 0,
          p: 0.75,
          frequencyPenalty: 0,
          presencePenalty: 0,
        }),
        timeoutMs
      )

      // ✅ Acceso seguro a la respuesta
      const generations = (response as { generations?: { text?: string }[] })?.generations
      const output = generations?.[0]?.text ?? ""

      return output.trim()
    } catch (err) {
      lastError = err
      if (attempt > retries) break
      const backoff = Math.min(2000 * 2 ** (attempt - 1), 8000)
      await sleep(backoff + Math.random() * 200)
    }
  }

  throw new Error(
    `[Cohere] Error tras ${retries + 1} intentos: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  )
}
