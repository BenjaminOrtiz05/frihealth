"use client"

import { cn } from "@/lib/utils"
import { Cpu, User } from "lucide-react"

interface MessageBubbleProps {
  sender: "user" | "system"
  text: string
}

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  const isUser = sender === "user"

  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-2xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <User className="w-7 h-7 text-blue-700" />
        ) : (
          <Cpu className="w-7 h-7 text-emerald-600" />
        )}
      </div>

      {/* Burbuja */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl shadow-md relative text-sm",
          isUser
            ? "bg-blue-200 text-gray-900 rounded-tr-none"
            : "bg-white/90 text-gray-800 border border-gray-200 rounded-tl-none"
        )}
      >
        {text}
      </div>
    </div>
  )
}
