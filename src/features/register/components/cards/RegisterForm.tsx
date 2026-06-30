'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shop, Category2, Location, Send, Profile, ArrowLeft2, TickCircle, Refresh2, Whatsapp } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRegister } from '@/src/features/register/hooks/useRegister'
import { fadeUp } from '@/src/features/components/animations/variants'
import Snackbar from '@/src/features/components/animations/SnackBar'

function Field({ icon, placeholder, value, onChange, type = 'text' }: any) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </span>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-11 h-12 rounded-2xl"
      />
    </div>
  )
}

export default function RegisterForm() {
  const {
    step, setStep, form, setForm, user,
    loading, error, setError,
    tipos, showTipos, loadingTipos,
    buscarTipos, seleccionarTipo,
    loginWithGoogle, initUser,
    handleStep1, handleSubmit, irAlPanel,
  } = useRegister()

  const [pressing, setPressing] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 'google' && (
          <motion.div key="google" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12 }}>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black mb-3 text-foreground">Únete a Qaalia</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Crea tu cuenta en segundos<br />No necesitas tarjeta de crédito.
              </p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <motion.div
                animate={{ scale: pressing ? 0.97 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  onClick={loginWithGoogle}
                  disabled={loading}
                  onTouchStart={() => setPressing(true)}
                  onTouchEnd={() => setPressing(false)}
                  onMouseDown={() => setPressing(true)}
                  onMouseUp={() => setPressing(false)}
                  variant="outline"
                  size="lg"
                  className="w-full gap-3 font-semibold rounded-2xl"
                >
                  {loading ? (
                    <Refresh2 size={18} color="currentColor" className="animate-spin text-primary" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continuar con Google
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'step1' && (
          <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2 text-foreground">Empecemos</h2>
              <p className="text-sm text-muted-foreground">Cuéntanos sobre tu negocio o local.</p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <Field icon={<Shop size={18} color="currentColor" />} placeholder="Nombre del negocio"
                value={form.nombre} onChange={(v: string) => setForm(f => ({ ...f, nombre: v }))} />

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                  <Category2 size={18} color="currentColor" />
                </span>
                <Input
                  placeholder="Tipo de negocio"
                  value={form.tipo}
                  onChange={e => buscarTipos(e.target.value)}
                  className="pl-11 h-12 rounded-2xl"
                  onBlur={() => setTimeout(() => { showTipos && null }, 200)}
                />
                {loadingTipos && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                    <Refresh2 size={16} color="currentColor" className="animate-spin" />
                  </span>
                )}
                {showTipos && tipos.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-50 max-h-44 overflow-y-auto bg-card border border-border shadow-lg">
                    {tipos.map(t => (
                      <button key={t.id} onMouseDown={() => seleccionarTipo(t)}
                        className="w-full text-left px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent">
                        {t.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Field icon={<Location size={18} color="currentColor" />} placeholder="Ciudad (Loja, Quito...)"
                value={form.ciudad} onChange={(v: string) => setForm(f => ({ ...f, ciudad: v }))} />

              <Button onClick={handleStep1} size="lg"
                className="w-full rounded-2xl font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Siguiente <Send size={15} color="currentColor" variant="Bold" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'step2' && (
          <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2 text-foreground">Casi listo</h2>
              <p className="text-sm text-muted-foreground">Un poco más sobre ti.</p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Profile size={18} color="currentColor" />
                </span>
                <Input
                  className="pl-11 h-12 rounded-2xl"
                  placeholder="Tu nombre"
                  value={form.nombre_dueno}
                  onChange={e => setForm(f => ({ ...f, nombre_dueno: e.target.value }))}
                />
                {user?.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full" />
                )}
              </div>
              <Field icon={<Whatsapp size={18} />} placeholder="Teléfono / WhatsApp" type="tel"
                value={form.telefono} onChange={(v: string) => setForm(f => ({ ...f, telefono: v }))} />
              <Button onClick={() => { setError(''); setStep('step1') }} variant="outline" size="lg"
                className="w-full rounded-2xl font-semibold gap-2">
                <ArrowLeft2 size={15} color="currentColor" /> Anterior
              </Button>
              <Button onClick={handleSubmit} disabled={loading} size="lg"
                className="w-full rounded-2xl font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? <Refresh2 size={18} color="currentColor" className="animate-spin" /> : 'Crear mi negocio'}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" variants={fadeUp} initial="hidden" animate="visible">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2 text-foreground">¡Listo!</h2>
              <p className="text-sm text-muted-foreground">Tu negocio está creado en Qaalia</p>
            </div>
            <div className="p-8 rounded-3xl border border-border bg-card flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <TickCircle size={36} color="currentColor" variant="Bold" className="text-success" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Puedes configurar tus reservas, crear tus espacios y empezar a recibir reservas.
              </p>
              <Button onClick={irAlPanel} size="lg"
                className="w-full rounded-2xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                Empezar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Snackbar
        mostrar={!!error}
        mensaje={error}
        tipo="error"
        onOcultar={() => setError('')}
      />
    </div>
  )
}