// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-50">
      {/* Fondo con imagen difuminada y capa verde pastel */}
      <div className="absolute inset-0">
        <Image
          src="/fondo-medico.png"
          alt="Fondo médico"
          fill
          className="object-cover blur-sm"
          priority
        />
        {/* Capa verde pastel suave */}
        <div className="absolute inset-0 bg-green-50/30 backdrop-blur-sm pointer-events-none"></div>
      </div>

      {/* Tarjeta central */}
      <Card className="relative z-10 w-full max-w-lg shadow-xl bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-8">
          {/* Logo y título con tipografía distinta */}
          <div className="flex items-center gap-3">
            <Bot className="w-10 h-10 text-blue-900 animate-bounce-slow" />
            <h1
              className="text-4xl font-extrabold text-blue-900 tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              FriHealth
            </h1>
          </div>

          <p className="text-center text-gray-700">
            Bienvenido al asistente de consultas médicas basado en IA.
          </p>

          <Link href="/chat" className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105">
              Ir al Chat
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
