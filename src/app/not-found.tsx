// src/app/not-found.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/chat");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl">
        <CardContent className="flex flex-col items-center text-center space-y-6 p-6">
          {/* Icono en círculo */}
          <div className="p-4 bg-amber-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-amber-600" />
          </div>

          {/* Título y mensaje */}
          <h1 className="text-2xl font-bold text-gray-800">
            Página no disponible
          </h1>
          <p className="text-gray-600">
            La página que intentas visitar no existe o está en mantenimiento:
          </p>

          {/* Cuadro con la ruta que causó el error */}
          <div className="w-full bg-gray-100 rounded-md p-2 text-sm text-gray-700 font-mono border border-gray-200 truncate">
            {pathname}
          </div>

          {/* Botón volver */}
          <Button
            onClick={handleBack}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
