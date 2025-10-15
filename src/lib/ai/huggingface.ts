/**
 * Hugging Face Inference v4.11+
 * Compatible con Mixtral y modelos Instruct
 */

import { InferenceClient } from "@huggingface/inference"

type HFOpts = {
  model?: string
  temperature?: number
  maxTokens?: number
  retries?: number
  timeoutMs?: number
}

const HF_KEY = process.env.HUGGINGFACE_API_KEY
const DEFAULT_MODEL =
  process.env.HUGGINGFACE_MODEL || "HuggingFaceH4/zephyr-7b-beta"
const DEFAULT_TIMEOUT = Number(process.env.HUGGINGFACE_TIMEOUT_MS || "10000")
const DEFAULT_RETRIES = Number(process.env.HUGGINGFACE_MAX_RETRIES || "2")

const client = HF_KEY ? new InferenceClient(HF_KEY) : null

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

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
 * Genera una respuesta desde Hugging Face
 */
export async function huggingFaceResponse(
  prompt: string,
  opts: HFOpts = {}
): Promise<string> {
  if (!HF_KEY || !client)
    throw new Error("HUGGINGFACE_API_KEY no configurada")

  if (!prompt.trim()) throw new Error("Prompt vacío")

  const model = opts.model || DEFAULT_MODEL
  const temperature = opts.temperature ?? 0.7
  const maxTokens = opts.maxTokens ?? 300
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const retries = opts.retries ?? DEFAULT_RETRIES

  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      attempt++

      // ✅ Usa el método textGeneration de forma tipada
      const response = (await withTimeout(
        client.textGeneration({
          model,
          inputs: prompt,
          parameters: {
            temperature,
            max_new_tokens: maxTokens,
            do_sample: true,
            top_p: 0.9,
          },
        }),
        timeoutMs
      )) as { generated_text?: string }

      const output = response.generated_text?.trim() ?? ""

      if (!output) throw new Error("Respuesta vacía del modelo Hugging Face")
      return output
    } catch (err) {
      lastError = err
      if (attempt > retries) break

      const backoff = Math.min(2000 * 2 ** (attempt - 1), 8000)
      await sleep(backoff + Math.random() * 200)
    }
  }

  throw new Error(
    `[HuggingFace] Error tras ${retries + 1} intentos: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  )
}
