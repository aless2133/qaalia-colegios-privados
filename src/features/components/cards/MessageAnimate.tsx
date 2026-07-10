'use client'

interface MensajeAnimadoProps {
  titulo: string
  descripcion: string
  animacion: React.ReactNode
  bg?: string
}

export default function MensajeAnimado({ titulo, descripcion, animacion, bg }: MensajeAnimadoProps) {
  return (
    <div className="flex items-center justify-center py-20 px-6 mt-16">
      <div
        className="flex flex-col items-center px-4 pt-4 pb-4 rounded-3xl w-full max-w-[220px]"
        style={{ background: bg ?? "transparent" }}
      >
        <h3 className="text-white text-[15px] font-semibold text-center mb-1">
          {titulo}
        </h3>
        <p
          className="text-[15px] font-medium text-center mb-1 leading-tight"
          style={{ color: "white" }}
        >
          {descripcion}
        </p>
        <div className="w-36 h-36 flex items-center justify-center">
          {animacion}
        </div>
      </div>
    </div>
  )
}