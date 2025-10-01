import { useState, useEffect } from "react"
import type { User } from "@/types"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) setUser(JSON.parse(userStr))
  }, [])

  return { user, isAuthenticated: !!user }
}
