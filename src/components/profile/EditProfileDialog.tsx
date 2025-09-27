"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
          Editar perfil
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Modifica tu información personal. El correo no puede ser cambiado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" placeholder="Escribe tu nombre" defaultValue="Juan" />
          </div>

          {/* Apellido */}
          <div className="grid gap-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" placeholder="Escribe tu apellido" defaultValue="Pérez" />
          </div>

          {/* Correo (solo lectura) */}
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" value="juan.perez@correo.com" disabled />
          </div>

          {/* Contraseña */}
          <div className="grid gap-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
