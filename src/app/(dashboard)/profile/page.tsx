"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";
import BackgroundIcons from "@/components/BackgroundIcons";
import EditProfileDialog from "@/components/profile/EditProfileDialog";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  // Cargar datos del usuario logueado
  useEffect(() => {
    // Puedes adaptar esto según cómo guardes el usuario (localStorage, cookie, etc.)
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Si no hay usuario logueado, redirige al login
      router.push("/login");
    }
  }, [router]);

  // Lógica de logout
  const handleLogout = () => {
    // Elimina token y datos del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirige al chat
    router.push("/chat");
  };

  // Mientras carga el usuario
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 relative p-6">
      <BackgroundIcons />

      {/* Botón volver */}
      <Link
        href="/chat/id"
        className="absolute top-6 left-6 flex items-center text-blue-900 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Volver</span>
      </Link>

      <div className="w-full max-w-3xl">
        {/* Título */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Información de usuario
        </h2>

        {/* Ficha */}
        <Card className="w-full h-[500px] shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm rounded-2xl p-10 flex flex-col justify-between">
          <div className="flex gap-10 h-full">
            {/* Foto rectangular clickeable con input oculto */}
            <label
              htmlFor="profilePic"
              className="w-48 h-56 bg-gray-200 rounded-xl shadow-md flex items-center justify-center self-center cursor-pointer hover:bg-gray-300 transition"
            >
              <User className="w-16 h-16 text-gray-400" />
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("Imagen seleccionada:", file.name);
                    // Aquí podrías guardar el archivo en estado o subirlo al backend
                  }
                }}
              />
            </label>

            {/* Datos centrados verticalmente */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="w-full max-w-md flex flex-col items-center space-y-4">
                {/* Campos */}
                <div className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <User className="w-5 h-5 text-blue-700" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <Mail className="w-5 h-5 text-blue-700" />
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <Shield className="w-5 h-5 text-blue-700" />
                  <div>
                    <p className="text-sm text-gray-500">Tipo de usuario</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Botones alineados con los campos */}
                <div className="flex gap-4 w-full mt-12">
                  <div className="flex-1">
                    <EditProfileDialog />
                  </div>
                  <Button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white w-full"
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
