import { QrCode, ShieldCheck, Bot, LayoutDashboard, CalendarCheck, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    icon: QrCode,
    title: 'Credencial QR dinámica',
    desc:  'Cada estudiante tiene un QR único que puede activarse, suspenderse o restringirse desde el panel. Reemplaza el carné físico — funciona desde el celular.',
  },
  {
    icon: ShieldCheck,
    title: 'Control de acceso por zona',
    desc:  'Define zonas dentro de tu institución (biblioteca, laboratorio, cafetería) y decide quién puede entrar a cada una. Registro automático de ingresos y salidas.',
  },
  {
    icon: Bot,
    title: 'Gesty — asistente con IA',
    desc:  'Chatbot entrenado con la información de tu institución. Responde preguntas de estudiantes y padres 24/7: horarios, bienestar, servicios, calendario académico.',
  },
  {
    icon: LayoutDashboard,
    title: 'Portal del estudiante',
    desc:  'El estudiante accede a su QR, horario, servicios disponibles y notificaciones desde un solo lugar. Sin apps adicionales que instalar.',
  },
  {
    icon: CalendarCheck,
    title: 'Agendamiento interno',
    desc:  'Los estudiantes agendan citas en bienestar estudiantil, enfermería y biblioteca directamente desde su portal. Sin llamadas ni filas.',
  },
  {
    icon: BarChart3,
    title: 'Analytics de acceso',
    desc:  'Visualiza patrones de entrada, detecta ausencias recurrentes y genera reportes por salón, área o período. Exportable a PDF.',
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
              <f.icon className="h-5 w-5 text-primary" />
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