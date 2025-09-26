"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export default function ChatInput() {
  return (
    <div className="border-t bg-white/90 backdrop-blur-sm shadow-md p-4 flex items-center gap-3">
      <Input
        placeholder="Escribe tu mensaje..."
        className="flex-1 rounded-lg border-gray-300"
        disabled
      />
      <Button
        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
        disabled
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}
