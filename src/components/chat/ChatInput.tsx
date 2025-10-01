"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSend: (text: string) => Promise<void>
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!value.trim()) return
    setSending(true)
    await onSend(value)
    setValue("")
    setSending(false)
  }

  return (
    <div className="border-t bg-white/90 backdrop-blur-sm shadow-md p-4 flex items-center gap-3">
      <Input
        placeholder="Escribe tu mensaje..."
        className="flex-1 rounded-lg border-gray-300"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={sending}
      />
      <Button
        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={handleSend}
        disabled={sending}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}
