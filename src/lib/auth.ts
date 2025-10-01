import jwt from "jsonwebtoken"

export function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.split(" ")[1]
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded as { id: string; email: string }
  } catch {
    return null
  }
}
