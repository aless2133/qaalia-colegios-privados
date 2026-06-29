'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Input    } from '@/components/ui/input'
import { Label    } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button   } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormState {
  name:        string
  email:       string
  institution: string
  role:        string
  message:     string
}

const EMPTY: FormState = {
  name: '', email: '', institution: '', role: '', message: '',
}

export default function Form() {
  const [form,    setForm]    = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  const valid =
    form.name.trim()        !== '' &&
    form.email.trim()       !== '' &&
    form.institution.trim() !== '' &&
    form.role               !== ''

  async function handleSubmit() {
    if (!valid) return
    setLoading(true)

    /**
     * TODO: reemplaza este fetch con tu endpoint real.
     * Ejemplo: await fetch('/api/demo-request', { method: 'POST', body: JSON.stringify(form) })
     */
    await new Promise(r => setTimeout(r, 1200))

    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          ¡Listo, {form.name.split(' ')[0]}!
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Recibimos tu solicitud. Nos contactamos en menos de 24 horas hábiles
          para coordinar tu demo de Qaalia.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Nombre + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f-name" className="text-sm">Nombre</Label>
          <Input
            id="f-name"
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={set('name')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f-email" className="text-sm">Correo</Label>
          <Input
            id="f-email"
            type="email"
            placeholder="nombre@institucion.edu"
            value={form.email}
            onChange={set('email')}
          />
        </div>
      </div>

      {/* Institución */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="f-inst" className="text-sm">Nombre de la institución</Label>
        <Input
          id="f-inst"
          placeholder="Ej. Colegio San Andrés"
          value={form.institution}
          onChange={set('institution')}
        />
      </div>

      {/* Rol */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm">Tu rol</Label>
        <Select onValueChange={v => setForm(prev => ({ ...prev, role: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rector">Rector / Director</SelectItem>
            <SelectItem value="coordinador">Coordinador académico</SelectItem>
            <SelectItem value="admin">Administrativo</SelectItem>
            <SelectItem value="docente">Docente</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mensaje opcional */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="f-msg" className="text-sm">
          ¿Qué necesita tu institución?{' '}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="f-msg"
          placeholder="Cuéntanos brevemente tu situación actual..."
          rows={3}
          value={form.message}
          onChange={set('message')}
          className="resize-none"
        />
      </div>

      <Button
        size="lg"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        onClick={handleSubmit}
        disabled={loading || !valid}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Solicitar demo gratuita'
        )}
      </Button>
    </div>
  )
}