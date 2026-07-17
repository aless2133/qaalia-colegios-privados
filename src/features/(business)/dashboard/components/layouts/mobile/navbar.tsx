'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home2, Icon, Box, Note1, Activity, Star, Cpu, TaskSquare } from 'iconsax-react'

interface NavItem { icon: Icon; label: string; href: string }

const NAV: NavItem[] = [
  { icon: Home2,        label: 'Inicio',    href: '/dashboard' },
  { icon: Activity,   label: 'Actividad',  href: '/activity' },
  { icon: TaskSquare, label: 'Propuestas',  href: '/shares' },
  { icon: Cpu,      label: 'Agente',  href: '/assistant' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch justify-around
                 border-t border-border bg-background/95 backdrop-blur
                 pb-[env(safe-area-inset-bottom)]"
    >
      {NAV.map(({ icon: IconCmp, label, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 active:opacity-70 transition-opacity"
          >
            <IconCmp
              size={20}
              color="currentColor"
              variant={active ? 'Bold' : 'Linear'}
              className={active ? 'text-primary' : 'text-muted-foreground'}
            />
            <span className={`text-[11px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}