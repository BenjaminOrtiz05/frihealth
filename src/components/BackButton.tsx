"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href: string
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="absolute top-6 left-6 flex items-center text-blue-900 hover:text-blue-700"
    >
      <ArrowLeft className="w-5 h-5 mr-1" />
      <span className="text-sm font-medium">Volver</span>
    </Link>
  )
}
