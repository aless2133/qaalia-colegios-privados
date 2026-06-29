import { GraduationCap, Wrench, Trophy, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const SEGMENTS = [
  {
    icon:  GraduationCap,
    name:  'Colegios privados',
    desc:  'Control de acceso, identidad estudiantil y un asistente IA que responde las mismas 30 preguntas que llegan a secretaría cada día.',
    range: '200 – 2 000 estudiantes',
  },
  {
    icon:  Wrench,
    name:  'Institutos técnicos y vocacionales',
    desc:  'Gestiona talleres, laboratorios y horarios rotativos con acceso controlado por QR y agendamiento directo a instructores.',
    range: '50 – 800 estudiantes',
  },
  {
    icon:  Trophy,
    name:  'Academias deportivas y culturales',
    desc:  'Carnés digitales, control de asistencia a entrenamientos y chatbot para responder dudas de padres y tutores fuera de horario.',
    range: '30 – 500 miembros',
  },
  {
    icon:  BookOpen,
    name:  'Centros de formación y cursos',
    desc:  'Identidad digital por cohorte, acceso a materiales por módulo y asistente IA que guía a los alumnos a lo largo del programa.',
    range: '20 – 300 alumnos',
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
              <s.icon className="h-6 w-6 text-primary" />
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