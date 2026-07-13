import Link from 'next/link'
import type { LayoutVariant } from '../layouts/LandingOverview'

interface FooterProps {
  variant: LayoutVariant
}

const LINK_GROUPS = [
  {
    title: 'Producto',
    links: [
      { label: 'Funciones',      href: '#funciones'  },
      { label: 'Precios',        href: '#precios'    },
      { label: 'Solicitar proyecto', href: '#demo'       },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Acerca de', href: '#' },
      { label: 'Contacto',  href: '#demo' },
    ],
  },
]

function LinkGroups() {
  return (
    <div className="flex gap-12 flex-wrap">
      {LINK_GROUPS.map(g => (
        <div key={g.title} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {g.title}
          </p>
          {g.links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
    <footer className="border-t border-border bg-background">
      <div className={`${desktop ? 'max-w-6xl mx-auto px-8' : 'px-5'} py-12`}>
        {desktop ? (
          <div className="flex items-start justify-between gap-10">
            <div className="max-w-xs flex flex-col gap-3">
              <span className="text-lg font-bold text-foreground">Qaalia</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El enlace único con IA que tu clínica necesita. Automatiza, cotiza y agenda 24/7 sin bloqueos.
              </p>
            </div>
            <LinkGroups />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-lg font-bold text-foreground">Qaalia</span>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                La identidad digital que tu centro de salud necesita.
              </p>
            </div>
            <LinkGroups />
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Qaalia. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho en Ecuador
          </p>
        </div>
      </div>
    </footer>
  )
}