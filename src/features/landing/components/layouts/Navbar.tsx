'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import type { LayoutVariant } from './LandingOverview'

interface NavbarProps {
  variant: LayoutVariant
}

const NAV_LINKS = [
  { label: 'Funciones', href: '#funciones' },
  { label: 'Precios',   href: '#precios'   },
  { label: 'Para quién', href: '#para-quien' },
]

/** Evita hydration mismatch con next-themes */
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Cambiar tema"
    >
      {theme === 'dark'
        ? <Sun  className="h-4 w-4" />
        : <Moon className="h-4 w-4" />
      }
    </Button>
  )
}

export default function Navbar({ variant }: NavbarProps) {
  const [open, setOpen] = useState(false)

  if (variant === 'mobile') {
    return (
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            Qaalia
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Menú">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-1 pb-2">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground py-2.5 px-1 transition-colors border-b border-border last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Button size="sm" className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full" asChild>
              <Link href="#demo" onClick={() => setOpen(false)}>Solicitar demo</Link>
            </Button>
          </div>
        )}
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          Qaalia
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium" asChild>
            <Link href="#demo">Solicitar demo</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}