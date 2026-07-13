import Functions from '../cards/Functions'
import Business  from '../cards/Business'
import Pricing   from '../cards/Pricing'
import Form      from '../cards/Form'
import type { LayoutVariant } from '../layouts/LandingOverview'

interface CoreProps {
  variant: LayoutVariant
}

interface SectionHeaderProps {
  eyebrow: string
  title:   string
  sub:     string
  center?: boolean
}

function SectionHeader({ eyebrow, title, sub, center }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 mb-12 ${center ? 'items-center text-center' : ''}`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground max-w-xl">{sub}</p>
    </div>
  )
}

export default function Core({ variant }: CoreProps) {
  const desktop = variant === 'desktop'
  const px  = desktop ? 'px-8' : 'px-5'
  const cnt = desktop ? 'max-w-6xl mx-auto' : ''

  return (
    <>
      {/* ── Funcionalidades ───────────────────────────── */}
      <section id="funciones" className={`py-20 ${px} bg-muted/40`}>
        <div className={cnt}>
          <SectionHeader
            eyebrow="Soluciones"
            title="Todo el control en un solo enlace"
            sub="Del caos multicanal al orden absoluto. Atiende, cotiza y agenda sin perder un solo mensaje."
          />
          <Functions />
        </div>
      </section>

      {/* ── Para quién ────────────────────────────────── */}
      <section id="para-quien" className={`py-20 ${px}`}>
        <div className={cnt}>
          <SectionHeader
            eyebrow="Mercado"
            title="Diseñado para la industria médica estética"
            sub="Clínicas estéticas, dermatólogos, cirujanos plásticos y spas médicos que necesitan escalar su atención."
          />
          <Business />
        </div>
      </section>

      {/* ── Precios ───────────────────────────────────── */}
      <section id="precios" className={`py-20 ${px} bg-muted/40`}>
        <div className={cnt}>
          <SectionHeader
            eyebrow="Precios"
            title="Empieza gratis. Crece con tu institución."
            sub="Sin contratos ni sorpresas. Cancela cuando quieras."
            center={desktop}
          />
          <Pricing />
        </div>
      </section>

      {/* ── Demo ──────────────────────────────────────── */}
      <section id="demo" className={`py-20 ${px}`}>
        <div className={cnt}>
          <Form />
        </div>
      </section>
    </>
  )
}