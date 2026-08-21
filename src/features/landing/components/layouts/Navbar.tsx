'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'framer-motion'
import { Button } from '@/components/landing/button'
import type { LayoutVariant } from './LandingOverview'

interface NavbarProps {
  variant: LayoutVariant
}

const NAV_LINKS = [
  { label: 'Funciones',  href: '#funciones'  },
  { label: 'Precios',    href: '/plan'    },
  { label: 'FAQs', href: '#para-quien' },
]

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1]

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
      className="relative text-lg text-foreground hover:text-foreground transition-colors py-1"
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

function Logo() {
  return (
    <Link href="/" aria-label="Qaalia">
      <Image
        src="/assets/logo/qaalia_logo_a.webp"
        alt="Qaalia"
        width={110}
        height={36}
        className="h-10 w-auto object-contain scale-[3.25] origin-left"
        priority
      />
    </Link>
  )
}

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

export default function Navbar({ variant }: NavbarProps) {
  const [open,     setOpen]     = useState(false)
  if (variant === 'mobile') {
return (
 <div className="relative z-50">
 <motion.div
className="backdrop-blur-md border px-5 py-4 overflow-hidden bg-primary border-transparent"
 >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
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
                      className="mt-3 py-4 bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-full font-bold"
                      asChild
                    >
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Empezar ahora
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

  return (
 <div className="relative z-50">
 <motion.div
className="backdrop-blur-md border bg-primary border-transparent px-8 py-4"
 >
        <div className="w-full flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <NavLink key={l.href} href={l.href} label={l.label} />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-2xl px-5"
                asChild
              >
                <Link href="#demo">Empezar</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}