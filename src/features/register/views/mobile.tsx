'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft2 } from 'iconsax-react'
import { Button } from '@/components/ui/button'
import RegisterForm from '@/src/features/register/components/cards/RegisterForm'

export default function RegisterMobile() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="relative overflow-hidden pt-14 pb-8 px-6">

        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-48 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.15) 0%, transparent 70%)' }}
        />

        <div className="absolute top-4 left-4 z-10">
          <Button variant="secondary" size="icon" className="rounded-full" asChild>
            <Link href="/">
              <ArrowLeft2 size={18} color="currentColor" />
            </Link>
          </Button>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <img src="/assets/logo/qaalia_logo.webp" alt="Qaalia" className="h-18 w-auto" />
        </motion.div>
      </div>

      {/* Formulario */}
      <div className="flex-1 px-5 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <RegisterForm />
        </motion.div>
      </div>

      <p className="text-center text-xs px-23 pb-80 text-muted-foreground">
        Al continuar aceptas{' '}
        <Link href="/terms" className="font-semibold text-foreground/80 hover:text-foreground transition-colors">
          Términos
        </Link>{' '}
        y{' '}
        <Link href="/privacy" className="font-semibold text-foreground/80 hover:text-foreground transition-colors">
          Política de privacidad
        </Link>
      </p>
    </div>
  )
}