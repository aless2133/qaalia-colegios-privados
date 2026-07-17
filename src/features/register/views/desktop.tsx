'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft2 } from 'iconsax-react'
import { Button } from '@/components/ui/button'
import RegisterForm from '@/src/features/register/components/cards/RegisterForm'

export default function RegisterDesktop() {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">

        <img
          src="/assets/images/fondo_qaalia.webp"
          alt="Qaalia"
          className="w-full h-full object-cover"
          style={{ objectPosition: '40% center' }}
        />

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, hsl(var(--background) / 0.75) 0%, hsl(var(--background) / 0.3) 100%)' }}
        />
        <div className="absolute top-8 left-8">
          <Button variant="outline" className="gap-2 bg-card/80 backdrop-blur-sm rounded-full font-semibold" asChild>
            <Link href="/">
              <ArrowLeft2 size={16} color="currentColor" />
              Volver
            </Link>
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-12 left-10 right-10"
        >



        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 bg-background">
        <div className="lg:hidden flex items-center mb-10">
        </div>

        {/* Animación de entrada del panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/assets/logo/qaalia_logo.webp" alt="Qaalia" className="h-24 w-auto mx-auto mb-6" />
          <RegisterForm />
        </motion.div>
        <p className="text-center text-sm mt-8 text-muted-foreground">
          Al continuar aceptas{' '}
          <Link href="/terms" className="font-semibold text-foreground/80 hover:text-foreground transition-colors">
            Términos
          </Link>{' '}
          y <br />{' '}
          <Link href="/privacy" className="font-semibold text-foreground/80 hover:text-foreground transition-colors">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}