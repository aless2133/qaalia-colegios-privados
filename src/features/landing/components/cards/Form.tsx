'use client'

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { TickCircle, Refresh2, Location, Sms, ArrowRight2, Call } from 'iconsax-react'
import { Input    } from '@/components/landing/input'
import { Label    } from '@/components/landing/label'
import { Textarea } from '@/components/landing/textarea'
import { Button   } from '@/components/landing/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/landing/select'
import { ArrowRight } from 'lucide-react'
interface FormState {
  name:            string
  email:           string
  institution:     string
  institutionType: string
  role:            string
  students:        string
  description:     string
}

const EMPTY: FormState = {
  name: '', email: '', institution: '',
  institutionType: '', role: '', students: '', description: '',
}

const EASE = [0.17, 0.55, 0.55, 1] as [number, number, number, number]

const fromLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}
const fromRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}
const fadeUp = (i: number): Variants => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: EASE } },
})

const VP = { once: true, margin: '-60px' } as const

const CONTACT = [
  { Icon: Call,      label: '099 381 1125' },
  { Icon: Sms,      label: 'info@qaalia.com' },
  { Icon: Location, label: 'Loja, Ecuador'        },
]

export default function Form() {
  const [form,    setForm]    = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const set    = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const setVal = (k: keyof FormState) => (v: string) =>
    setForm(p => ({ ...p, [k]: v }))

  const valid =
    form.name.trim()        !== '' &&
    form.email.trim()       !== '' &&
    form.institution.trim() !== '' &&
    form.institutionType    !== '' &&
    form.role               !== '' &&
    form.students           !== ''

  async function handleSubmit() {
    if (!valid) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 py-14 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
          <TickCircle size={28} color="currentColor" className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          ¡Listo, {form.name.split(' ')[0]}!
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Recibimos tu solicitud. Nos contactamos en menos de 24 horas hábiles
          para coordinar tu demo de Qaalia.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <motion.div
        variants={fromLeft}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        className="flex flex-col gap-7"
      >
        {/* Eyebrow */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          Hablemos de tu flujo de pacientes
        </p>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Hola,{' '}
            <span className="text-primary">¿listo para</span>
            <br />automatizar tu clínica?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            No dudes en contactarnos si tienes preguntas sobre cómo Qaalia puede
            ordenar tus mensajes, cotizar por ti y llenar tu agenda.
          </p>
        </div>

        {/* Tagline + contact */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-foreground">
            El enlace único definitivo para tu negocio.
          </p>
          {CONTACT.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <Icon size={16} color="currentColor" className="text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── RIGHT: form ────────────────────────────────────── */}
      <motion.div
        variants={fromRight}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        className="flex flex-col gap-4"
      >
        {/* Nombre + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
            <Label htmlFor="f-name" className="text-sm">Nombre y Apellido</Label>
            <Input id="f-name" placeholder="Tu nombre completo" value={form.name} onChange={set('name')} />
          </motion.div>
          <motion.div variants={fadeUp(1)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
            <Label htmlFor="f-email" className="text-sm">Email</Label>
            <Input id="f-email" type="email" placeholder="nombre@institucion.edu" value={form.email} onChange={set('email')} />
          </motion.div>
        </div>

        {/* Institución */}
        <motion.div variants={fadeUp(2)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
          <Label htmlFor="f-inst" className="text-sm">Nombre de la clínica o consultorio</Label>
          <Input id="f-inst" placeholder="Ej. DermaBeauty Clinic" value={form.institution} onChange={set('institution')} />
        </motion.div>

        {/* Tipo + Rol */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeUp(3)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
            <Label className="text-sm">Especialidad</Label>
            <Select onValueChange={setVal('institutionType')}>
              <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="estetica">Medicina Estética</SelectItem>
                <SelectItem value="dermatologia">Dermatología</SelectItem>
                <SelectItem value="plastica">Cirugía Plástica</SelectItem>
                <SelectItem value="odontologia">Odontología / Spa</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={fadeUp(4)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
            <Label className="text-sm">Tu rol</Label>
            <Select onValueChange={setVal('role')}>
              <SelectTrigger><SelectValue placeholder="Selecciona tu rol" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico Especialista</SelectItem>
                <SelectItem value="gerente">Gerente / Administrador</SelectItem>
                <SelectItem value="marketing">Marketing / Ventas</SelectItem>
                <SelectItem value="recepcion">Recepción / Atención</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Número de profesionales (reutilizado para volumen de leads) */}
        <motion.div variants={fadeUp(5)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
          <Label className="text-sm">Volumen de mensajes al mes</Label>
          <Select onValueChange={setVal('students')}>
            <SelectTrigger><SelectValue placeholder="¿Cuántos pacientes escriben?" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="menos50">Menos de 100 mensajes</SelectItem>
              <SelectItem value="50-200">100 – 500 mensajes</SelectItem>
              <SelectItem value="200-500">500 – 1,000 mensajes</SelectItem>
              <SelectItem value="500-1000">Más de 1,000 mensajes</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        {/* ¿Cómo describirías tu institución? */}
        <motion.div variants={fadeUp(6)} initial="hidden" whileInView="visible" viewport={VP} className="flex flex-col gap-1.5">
          <Label htmlFor="f-desc" className="text-sm">
            ¿Cómo describirías tu centro de salud?{' '}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Textarea
            id="f-desc"
            placeholder="Cuéntanos brevemente tu situación actual..."
            rows={3}
            value={form.description}
            onChange={set('description')}
            className="resize-none"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp(7)} initial="hidden" whileInView="visible" viewport={VP}>
          <Button
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 gap-2"
            onClick={handleSubmit}
            disabled={loading || !valid}
          >
            {loading ? (
              <>
                <Refresh2 size={16} color="currentColor" className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar
                <ArrowRight size={16} color="currentColor" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}