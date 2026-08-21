import Link from 'next/link'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'
import WaveDivider from '@/src/features/landing/components/sections/WaveDivider'

interface FooterProps {
  variant: LayoutVariant
}

const LINK_GROUPS = [
  {
    title: 'Producto',
    links: [
      { label: 'Funciones',      href: '#funciones'  },
      { label: 'Precios',        href: '/plan'       },
      { label: 'Para quién',     href: '#para-quien' },
      { label: 'Solicitar demo', href: '#demo'       },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Acerca de', href: '#'    },
      { label: 'Contacto',  href: '#demo' },
    ],
  },
]

const LEGAL_LINKS = [
  { label: 'Política de Privacidad', href: '/privacy' },
  { label: 'Términos y Condiciones', href: '/terms'   },
]

function BrandBlock() {
  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <span className="text-2xl font-bold text-background">Qaalia</span>
      <p className="text-sm text-background/70 leading-relaxed">
        El centro de contexto para tus proyectos con IA. Organiza, conecta 
        modelos y nunca repitas información.
      </p>
      <div className="w-10 h-px bg-background/20 my-1" />
      <div className="flex flex-col gap-2">
        {LEGAL_LINKS.map(l => (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm text-background/70 hover:text-background transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function LinkGroups({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-col gap-8' : 'flex gap-16'}>
      {LINK_GROUPS.map(g => (
        <div key={g.title} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-background">
            {g.title}
          </p>
          {g.links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-background/70 hover:text-background transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Footer({ variant }: FooterProps) {
  const desktop = variant === 'desktop'

  return (
    <footer className="relative bg-[color-mix(in_oklch,var(--foreground)_5%,black_95%)]">
  <WaveDivider fill="color-mix(in oklch, var(--foreground) 5%, black 95%)" />

      <div className={`${desktop ? 'max-w-6xl mx-auto px-8' : 'px-5'} py-16`}>
        {desktop ? (
          <div className="flex items-start justify-between gap-10">
            <BrandBlock />
            <LinkGroups />
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <BrandBlock />
            <LinkGroups compact />
          </div>
        )}

        <div className="mt-14 pt-6 border-t border-background/10 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} Qaalia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}