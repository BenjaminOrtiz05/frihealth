"use client"

export default function BackgroundPattern() {
  // Array de colores posibles para los íconos
  const colors = ["#4ade80", "#22d3ee", "#facc15", "#f87171", "#a78bfa"]

  // Generar posiciones y colores aleatorios para los íconos
  const icons = Array.from({ length: 100 }).map(() => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
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
  )
}