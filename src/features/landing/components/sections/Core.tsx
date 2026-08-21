import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'
import WaveDivider from '@/src/features/landing/components/sections/WaveDivider'
import StarFree from '@/src/features/landing/components/cards/StarFree/StarFree'
import Tree from '@/src/features/landing/components/cards/Tree'
import Details from '@/src/features/landing/components/cards/Details/Details'
import Demos from '@/src/features/landing/components/cards/Demos/Demos'
import MultipleModels from '@/src/features/landing/components/cards/MultipleModels'
import Reviews from '@/src/features/landing/components/cards/Reviews'
import DetailsTwo from '@/src/features/landing/components/cards/DetailsTwo/DetailsTwo'

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
  const pb  = desktop ? 'pb-40' : 'pb-32'

  return (
    <>
     {/* ── Árbol (3 badges) ──────────────────────────── */}
      <section id="funciones" className={`relative pt-20 ${pb} ${px} bg-chart-4`}>
      <WaveDivider fill="var(--chart-4)" />
        <div className={cnt}>
          <Tree variant={variant} />
        </div>
      </section>

      {/* ── Detalles (2 bloques) ─────────────────────── */}
     <section id="para-quien" className={`relative pt-20 ${pb} ${px} bg-[var(--chart-6)]`}>
         <WaveDivider fill="var(--chart-6)" />
         <div className={`${cnt} ${desktop ? 'translate-x-11' : ''}`}>
          <Details variant={variant} />
        </div>
      </section>



      {/* ── Demos ─────────────────────────────────────── */}
      <section id="demos" className={`relative pt-20 ${pb} ${px} bg-[var(--chart-7)]`}>
         <WaveDivider fill="var(--chart-7)" />
       <div className={`${cnt} ${desktop ? 'translate-x-11' : ''}`}>
          <Demos variant={variant} />
        </div>
      </section>

      {/* ── Modelos ───────────────────────────────────── */}
     <section id="modelos" className={`relative pt-20 ${pb} ${px} bg-[var(--chart-1)]`}>
         <WaveDivider fill="var(--chart-1)" />
        <div className={cnt}>
          <MultipleModels variant={variant} />
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────── */}
     <section id="reviews" className={`relative pt-20 ${pb} ${px} bg-[var(--chart-3)]`}>
         <WaveDivider fill="var(--chart-3)" />
        <div className={cnt}>
          <Reviews variant={variant} />
        </div>
      </section>

       {/* ── Empieza gratis ────────────────────────────── */}
      <section id="empieza-gratis" className={`relative pt-12 pb-20 ${px} bg-[var(--chart-6)]`}>
        <WaveDivider fill="var(--chart-6)" />
        <div className={`${cnt} ${desktop ? 'translate-x-11' : ''}`}>
          <StarFree variant={variant} />
        </div>
      </section>
    </>
  )
}