'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Moon, Menu, X } from 'lucide-react'
import { Sun1 } from 'iconsax-react'
import { useTheme } from 'next-themes'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { LayoutVariant } from './LandingOverview'

interface NavbarProps {
  variant: LayoutVariant
}

const NAV_LINKS = [
  { label: 'Funciones',  href: '#funciones'  },
  { label: 'Precios',    href: '#precios'    },
  { label: 'Para quién', href: '#para-quien' },
]

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1]

/* ─────────────────────────────────────────────────────────
   SUB-COMPONENTES
   ───────────────────────────────────────────────────────── */

/** Link con subrayado animado — sólo el trazo, sin contenedor */
function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-px bg-primary w-full block"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
    </Link>
  )
}

/** Toggle de tema — suppressHydrationWarning pattern */
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
        ? <Sun1 color="currentColor" className="text-primary !h-6 !w-6" />
        : <Moon className="!h-5 !w-5" />
      }
    </Button>
  )
}

/**
 * Logo — asegúrate de que el archivo esté en:
 * public/assets/logo/qaalia_splash.png
 */
function Logo() {
  return (
    <Link href="/" aria-label="Qaalia">
      <Image
        src="/assets/logo/qaalia_splash.png"
        alt="Qaalia"
        width={110}
        height={36}
        className="h-8 w-auto object-contain scale-[3.25] origin-left"
        priority
      />
    </Link>
  )
}

/* ── Variants para el menú mobile ────────────────── */
const menuContainer: Variants = {
  closed: { opacity: 0, height: 0   },
  open:   { opacity: 1, height: 'auto' },
}

const menuItem = (i: number): Variants => ({
  closed: { opacity: 0, x: -10 },
  open:   {
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.22, ease: EASE },
  },
})

/* ─────────────────────────────────────────────────────────
   NAVBAR PRINCIPAL
   ───────────────────────────────────────────────────────── */
export default function Navbar({ variant }: NavbarProps) {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 24)
  })

  /* ── Estilos animados compartidos ── */
  const pillBase = {
    from: { marginLeft: 0, marginRight: 0, marginTop: 0, borderRadius: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  }

  /* ══════════════════ MOBILE ══════════════════════ */
  if (variant === 'mobile') {
    return (
      <div className="sticky top-0 z-50">
        <motion.div
          animate={scrolled
            ? { marginLeft: 14, marginRight: 14, marginTop: 10, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }
            : pillBase.from
          }
          transition={{ duration: 0.35, ease: EASE }}
          className="bg-background/95 backdrop-blur-md border border-border px-5 py-4 overflow-hidden"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <ThemeToggle />

              {/* Hamburger/X con swap animado */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(prev => !prev)}
                aria-label="Menú"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{    rotate:  90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="!h-5 !w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate:  90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{    rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="!h-5 !w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Menú expandible */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="mobile-menu"
                variants={menuContainer}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-col gap-1 pb-2">
                  {NAV_LINKS.map((l, i) => (
                    <motion.div
                      key={l.href}
                      variants={menuItem(i)}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        href={l.href}
                        className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-1 transition-colors border-b border-border last:border-0"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={menuItem(NAV_LINKS.length)}
                    initial="closed"
                    animate="open"
                  >
                    <Button
                      size="sm"
                      className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-full"
                      asChild
                    >
                      <Link href="#demo" onClick={() => setOpen(false)}>
                        Solicitar demo
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  /* ══════════════════ DESKTOP ═════════════════════ */
  return (
    <div className="sticky top-0 z-50">
      <motion.div
        animate={scrolled
          ? {
              marginLeft:    32,
              marginRight:   32,
              marginTop:     12,
              borderRadius:  9999,
              paddingLeft:   24,
              paddingRight:  24,
              paddingTop:    10,
              paddingBottom: 10,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }
          : {
              ...pillBase.from,
              paddingLeft:   32,
              paddingRight:  32,
              paddingTop:    16,
              paddingBottom: 16,
            }
        }
        transition={{ duration: 0.4, ease: EASE }}
        className="bg-background/95 backdrop-blur-md border border-border"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-5"
              asChild
            >
              <Link href="#demo">Solicitar demo</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}