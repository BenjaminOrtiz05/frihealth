"use client"

import ChatSidebarAuth from "@/components/chat/ChatSidebarAuth"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"

export default function ChatPageAuth() {
  const colors = ["#4ade80", "#22d3ee", "#facc15", "#f87171", "#a78bfa"]

  const icons = Array.from({ length: 500 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      {/* Patrón de íconos */}
      <div className="absolute inset-0 pointer-events-none">
        {icons.map((icon, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className="absolute"
            style={{ top: icon.top, left: icon.left }}
          >
            <path
              d="M8 2v4M8 10v4M2 8h4M10 8h4"
              stroke={icon.color}
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>

      {/* Sidebar autenticado */}
      <ChatSidebarAuth />

      {/* Main Chat */}
      <div className="flex flex-col flex-1 p-6 relative z-10">
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  )
}
