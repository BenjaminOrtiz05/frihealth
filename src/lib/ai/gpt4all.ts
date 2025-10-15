/**
 * GPT4All v4.0.0
 * -------------------------------------------------------
 * Adaptador para fallback
 * Usa el servidor local de GPT4All (.gguf)
 */

import fetch from "node-fetch"

type GPT4AllOpts = {
  temperature?: number
  maxTokens?: number
  retries?: number
  timeoutMs?: number
}

// Configuración base
const SERVER_URL =
  process.env.GPT4ALL_SERVER_URL || "http://localhost:5050/generate"
const DEFAULT_TEMPERATURE = Number(process.env.GPT4ALL_TEMPERATURE || "0.3")
const DEFAULT_MAX_TOKENS = Number(process.env.GPT4ALL_MAX_TOKENS || "300")
const DEFAULT_TIMEOUT = Number(process.env.GPT4ALL_TIMEOUT_MS || "10000")
const DEFAULT_RETRIES = Number(process.env.GPT4ALL_MAX_RETRIES || "2")

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout tras ${ms}ms`)), ms)
  })
  try {
    const result = await Promise.race([promise, timeout])
    return result as T
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

// 🧠 Define el tipo esperado de respuesta del servidor
interface GPT4AllResponse {
  response?: string
  [key: string]: unknown
}

/**
 * Genera una respuesta usando el servidor local de GPT4All
 */
export async function gpt4allResponse(
  prompt: string,
  opts: GPT4AllOpts = {}
): Promise<string> {
  if (!prompt.trim()) throw new Error("Prompt vacío")

  const temperature = opts.temperature ?? DEFAULT_TEMPERATURE
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const retries = opts.retries ?? DEFAULT_RETRIES

  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      attempt++

      const response = await withTimeout(
        fetch(SERVER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, temperature, maxTokens }),
        }),
        timeoutMs
      )

      if (!response.ok) {
        throw new Error(
          `Servidor GPT4All respondió con ${response.status}: ${response.statusText}`
        )
      }

      // ✅ Convertimos con tipado seguro
      const data = (await response.json()) as GPT4AllResponse
      const text =
        typeof data.response === "string" ? data.response.trim() : ""

      if (!text) throw new Error("Respuesta vacía del servidor GPT4All")

      return text
    } catch (err) {
      lastError = err
      if (attempt > retries) break

      const backoff = Math.min(2000 * 2 ** (attempt - 1), 8000)
      await sleep(backoff + Math.random() * 200)
    }
  }

  throw new Error(
    `[GPT4All] Error tras ${retries + 1} intentos: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  )
}
