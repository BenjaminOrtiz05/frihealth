"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface ChatCardProps {
  title: string
  preview: string
}

export default function ChatCard({ title, preview }: ChatCardProps) {
  return (
    <Card className="bg-white/90 border border-gray-200 shadow-sm rounded-xl 
      hover:shadow-md hover:scale-[1.01] transition-transform cursor-pointer mx-3">
      <CardContent className="flex items-start gap-3 p-4">
        {/* Icono de chat */}
        <div className="p-2 rounded-lg bg-blue-50 text-blue-800 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {preview}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
