import Image from "next/image"
import BackgroundIcons from "@/components/BackgroundIcons"
import BackButton from "@/components/BackButton"
import LoginForm from "@/components/login/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda */}
      <div className="hidden md:flex w-2/5 bg-blue-100 items-center justify-center">
        <Image
          src="/banner-form.webp"
          alt="Ilustración de login"
          width={400}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Columna derecha */}
      <div className="flex w-full md:w-3/5 items-center justify-center relative p-6 bg-gray-50">
        <BackgroundIcons />
        <BackButton href="/chat"/>
        <LoginForm />
      </div>
    </div>
  )
}
