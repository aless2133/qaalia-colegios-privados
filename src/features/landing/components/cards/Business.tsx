import { Card, CardContent } from '@/components/ui/card'
import { Bank, Building3, Buildings2, Shop } from 'iconsax-react'

const SEGMENTS = [
  {
    icon:  Building3,
    name:  'Clínicas de Medicina Estética',
    desc:  'Catálogo visual de tratamientos, agendamiento automatizado y filtro de pacientes sin lidiar con los bloqueos de Meta.',
    range: 'Alto volumen de leads',
  },
  {
    icon:  Buildings2,
    name:  'Dermatología Cosmética',
    desc:  'Asistente IA que responde dudas frecuentes sobre cuidado de la piel, pre-califica y agenda citas en el calendario del doctor.',
    range: 'Consultorios privados',
  },
  {
    icon:  Shop,
    name:  'Cirugía Plástica',
    desc:  'Recepción de formularios de valoración previa con alta privacidad y atención 24/7 centralizada en un solo enlace.',
    range: 'Tratamientos premium',
  },
  {
    icon:  Bank,
    name:  'Odontología Estética y Spas',
    desc:  'Centraliza mensajes de Instagram, WhatsApp y TikTok en un embudo ordenado. Cero leads perdidos, más citas concretadas.',
    range: 'Múltiples especialistas',
  },
]

export default function Business() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {SEGMENTS.map(s => (
        <Card
          key={s.name}
          className="bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group cursor-default"
        >
          <CardContent className="pt-6 pb-6 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
              <s.icon size={24} color="currentColor" className="text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <p className="text-xs font-medium text-primary mt-1">{s.range}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}