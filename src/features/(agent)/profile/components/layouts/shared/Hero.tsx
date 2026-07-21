'use client'

interface HeroProps {
  tipoNegocio: string
  ciudad:      string
  loading:     boolean
}

export default function Hero({ tipoNegocio, ciudad, loading }: HeroProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Perfil del negocio</h1>
      <p className="text-[13px] font-semibold text-muted-foreground">
        {loading ? '' : [tipoNegocio, ciudad].filter(Boolean).join(' · ')}
      </p>
    </div>
  )
}