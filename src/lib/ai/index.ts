/**
 * Punto de entrada unificado de IA
 * --------------------------------
 * Reexporta todos los módulos y fallback.
 */

export { cohereResponse } from "./cohere"
export { huggingFaceResponse } from "./huggingface"
export { gpt4allResponse } from "./gpt4all"
export { getAIResponse } from "./fallback"

export type { AIResponseOptions, FallbackOrder } from "./fallback"
