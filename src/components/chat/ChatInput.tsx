"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSend: (text: string) => Promise<void>
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!text.trim()) return
    setLoading(true)
    await onSend(text)
    setText("")
    setLoading(false)
  }

  return (
    <div className="border-t bg-white/90 backdrop-blur-sm shadow-md p-4 flex items-center gap-3">
      <Input
        placeholder="Escribe tu mensaje..."
        className="flex-1 rounded-lg border-gray-300"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={loading}
      />
      <Button
        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={handleSend}
        disabled={loading}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}
