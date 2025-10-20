// src/components/chat/ChatCardMenu.tsx
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash } from "lucide-react"

interface ChatCardMenuProps {
  conversationId: string
  onDelete: () => void
}

export default function ChatCardMenu({ conversationId, onDelete }: ChatCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-gray-100 transition">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 hover:bg-red-100 flex items-center gap-2 cursor-pointer"
        >
          <Trash className="w-4 h-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
