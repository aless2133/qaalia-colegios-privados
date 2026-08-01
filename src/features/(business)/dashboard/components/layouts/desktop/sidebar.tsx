'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  Home2, Profile2User, TaskSquare, Wallet2,
  DocumentText, Setting2, LogoutCurve,
  Icon,
  User,
  Activity,
  Cpu,
  DirectInbox,
} from 'iconsax-react'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface NavItem { icon: Icon; label: string; href: string }

const NAV: NavItem[] = [
  { icon: Home2,        label: 'Inicio',    href: '/dashboard' },
  { icon: DirectInbox,   label: 'Bandeja',     href: '/activity' },
  { icon: TaskSquare, label: 'Actividad',     href: '/shares' },
  { icon: Cpu, label: 'Agente',     href: '/assistant' },
]

interface SidebarProps {
  negocio: NegocioData | null
}

export default function Sidebar({ negocio }: SidebarProps) {
  const pathname = usePathname()
  const iniciales = negocio?.nombre_dueno
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0] ?? '')
    .join('')
    .toUpperCase() ?? '?'

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed inset-y-0 left-0 z-20 border-r border-border bg-card">
      {/* Marca */}
      <div className="px-6 py-6">
        <span className="text-xl font-black text-foreground">Qaalia</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV.map(({ icon: IconCmp, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-accent text-primary'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <IconCmp size={18} color="currentColor" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Ajustes + cuenta */}
      <div className="px-3 pb-4 flex flex-col gap-1 border-t border-border pt-3 mx-3">
        <div className="flex items-center gap-3 py-2 rounded-2xl transition-colors hover:bg-muted/60">
          <div className="w-8 h-8 rounded-3xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
            {negocio?.foto_dueno ? (
              <img src={negocio.foto_dueno} alt={negocio.nombre_dueno} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[11px] font-black text-primary">{iniciales}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {negocio?.nombre_dueno ?? 'Mi cuenta'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {negocio?.correo ?? ''}
            </p>
          </div>
        </div>

        <button className="w-full flex items-center gap-2 py-2 rounded-2xl text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
          <LogoutCurve size={18} color="currentColor" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}