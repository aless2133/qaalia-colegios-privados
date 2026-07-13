import { QrCode, ShieldCheck, Bot, LayoutDashboard, CalendarCheck, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Calendar, Category2, Chart2, Messages2, ScanBarcode, ShieldTick } from 'iconsax-react'

const FEATURES = [
  {
    icon: ScanBarcode,
    title: 'Enlace Único Centralizado',
    desc:  'Tu embudo definitivo. Un solo enlace en tu bio de Instagram, TikTok o WhatsApp que unifica toda tu comunicación y transmite máximo profesionalismo.',
  },
  {
    icon: Messages2,
    title: 'Agente IA de Atención 24/7',
    desc:  'Chatbot entrenado con tu tono de marca, reglas y catálogo. Responde dudas, pre-califica al paciente y atiende cuando tu equipo está descansando.',
  },
  {
    icon: ShieldTick,
    title: 'Catálogo sin bloqueos de Meta',
    desc:  'Muestra tus tratamientos (bótox, limpiezas, etc.) con fotos y descripciones detalladas en un entorno seguro, eludiendo la estricta censura de WhatsApp.',
  },
  {
    icon: Category2,
    title: 'Dashboard Kanban Operativo',
    desc:  'Adiós al caos. Cada interacción del cliente aparece en tu panel con estados claros (Pendiente, En proceso, Completado). El orden absoluto para tus leads.',
  },
  {
    icon: Calendar,
    title: 'Agendamiento Automático',
    desc:  'El Agente IA muestra tus horarios disponibles, pide los datos necesarios y agenda la cita directamente. Sin cruce de horarios ni fricciones.',
  },
  {
    icon: Chart2,
    title: 'Acciones y Formularios',
    desc:  'Crea flujos específicos: "Cotizar Tratamiento", "Reportar Problema" o "Valoración Previa", pidiendo los datos exactos que necesitas antes de la cita.',
  },
]

export default function Functions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {FEATURES.map(f => (
        <Card
          key={f.title}
          className="bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-default"
        >
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
               <f.icon size={20} color="currentColor" className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}