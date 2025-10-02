import type { ChatMessage } from "@/types"

export function buildPrompt(messages: ChatMessage[]) {
  const disclaimer =
    "⚠️ Importante: Este asistente brinda información médica general y no reemplaza la consulta con un profesional de salud."

  const historyContext = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n")

  return `
  ${disclaimer}
  
  Contexto de conversación:
  ${historyContext}

  Instrucciones:
  - Responde en lenguaje claro y sencillo.
  - Si detectas síntomas graves, recomienda acudir al médico de inmediato.
  - Si corresponde, sugiere la especialidad médica adecuada.
  `
}
