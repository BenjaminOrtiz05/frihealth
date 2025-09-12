// src/app/page.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <h1 className="text-4xl font-bold text-center">
            Chat Médico IA
          </h1>
          <p className="text-center text-muted-foreground">
            Bienvenido al asistente de consultas médicas basado en IA.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
