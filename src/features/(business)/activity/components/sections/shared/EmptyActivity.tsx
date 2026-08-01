'use client'

import MensajeAnimado from '@/src/features/components/cards/MessageAnimate'
import LottieNodata    from '@/src/features/components/animations/LottieAnimation'
import type { EstadoActividad } from '@/src/features/(business)/activity/hooks/useActivity'

interface Props {
  estado: EstadoActividad
}

const COPY: Record<EstadoActividad, { titulo: string; descripcion: string }> = {
  pendiente: {
    titulo: 'Sin solicitudes pendientes',
    descripcion: 'Aquí aparecerán los mensajes de tus clientes quienes ayan realizado alguna actividad.',
  },
  en_proceso: {
    titulo: 'Nada en proceso todavía',
    descripcion: 'Las solicitudes que marques como "en proceso" se mostrarán en esta sección.',
  },
  completada: {
    titulo: 'Aún no hay completadas',
    descripcion: 'Cuando cierres una solicitud como completada, la verás aquí.',
  },
  rechazada: {
    titulo: 'Sin solicitudes rechazadas',
    descripcion: 'Las solicitudes que rechaces aparecerán en esta sección.',
  },
}

export default function EmptyActivity({ estado }: Props) {
  const copy = COPY[estado]

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="lg:-mt-28 -mt-23">
        <MensajeAnimado
          titulo={copy.titulo}
          descripcion={copy.descripcion}
          animacion={<LottieNodata variant="search" />}
        />
      </div>
    </div>
  )
}