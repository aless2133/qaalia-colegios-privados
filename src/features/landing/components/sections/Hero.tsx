import Link from 'next/link'
import { ArrowRight, QrCode, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import type { LayoutVariant } from '../layouts/LandingOverview'
import { Flash, ScanBarcode, ShieldTick, Star, Star1 } from 'iconsax-react'
import { useRouter } from 'next/navigation'
interface HeroProps {
  variant: LayoutVariant
}

/** Mockup visual del carné QR — no depende de imágenes externas */
function StudentCardMockup() {
  return (
    <div className="relative select-none">
      {/* Glow ambiental */}
      <div
        className="absolute inset-0 scale-110 rounded-3xl blur-3xl -z-10"
        style={{ background: 'hsl(var(--primary) / 0.12)' }}
      />

      {/* Tarjeta principal */}
      <div className="w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header de la tarjeta */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-primary/5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Qaalia · ID Estudiantil
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">Colegio San Andrés</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">Q</span>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="px-5 py-4 flex gap-4 items-start">
          {/* QR block */}
          <div className="w-20 h-20 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
            <QrCode className="w-14 h-14 text-background" strokeWidth={1.5} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Estudiante</p>
            <p className="text-sm font-semibold text-foreground truncate">Javier Romero</p>
            <p className="text-xs text-muted-foreground">3ro Bachillerato · A</p>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Acceso activo</span>
            </div>
          </div>
        </div>

        {/* Footer de la tarjeta */}
        <div className="px-5 pb-4">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '75%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Ciclo 3 de 4</p>
        </div>
      </div>

      {/* Badge flotante verificado */}
      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg">
        ✓ Verificado
      </div>

      {/* Badge flotante acceso */}
      <div className="absolute -bottom-3 -left-3 bg-card border border-border text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg text-foreground flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Biblioteca · permitido
      </div>
    </div>
  )
}

export default function Hero({ variant }: HeroProps) {
  const desktop = variant === 'desktop'
  const router = useRouter()

  return (
    <section className={`bg-background ${desktop ? 'py-28 px-8' : 'py-16 px-5'}`}>
      <div className={desktop ? 'max-w-6xl mx-auto flex items-center gap-20' : 'flex flex-col gap-12'}>

        {/* Bloque de texto */}
        <div className={`flex flex-col gap-6 ${desktop ? 'flex-1' : ''}`}>
          <Badge className="w-fit bg-accent text-accent-foreground border-0 text-[11px] font-semibold tracking-wide">
            Identidad digital para instituciones educativas
          </Badge>

          <h1 className={`font-bold text-foreground leading-[1.1] ${desktop ? 'text-[3.25rem]' : 'text-4xl'}`}>
            Tu institución,<br />
            <span className="text-primary">conectada</span> y segura.
          </h1>

          <p className="text-muted-foreground leading-relaxed max-w-md text-base">
            Qaalia da a cada estudiante una identidad digital con QR, controla
            el acceso a cada espacio y responde preguntas con un asistente IA
            entrenado con tu información institucional.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={() => router.push('/register')}
            >
                Empezar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#funciones">Ver funciones</Link>
            </Button>
          </div>

          {/* Señales de confianza */}
          <div className="flex flex-wrap gap-5 pt-1">
            {[
              { icon: ScanBarcode,       label: 'QR único por estudiante' },
              { icon: ShieldTick,  label: 'Control de acceso real'  },
              { icon: Star,          label: 'Listo en minutos'        },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon size={20} color="currentColor" className="text-primary"/>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div className={`${desktop ? 'flex-1 flex justify-center' : 'flex justify-center'}`}>
          <StudentCardMockup />
        </div>
      </div>
    </section>
  )
}