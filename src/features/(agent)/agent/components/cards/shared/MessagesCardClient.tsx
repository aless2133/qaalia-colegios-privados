'use client'

import type { MensajeAgente } from '@/src/features/(agent)/agent/hooks/useAgent'

interface Props {
  mensaje: MensajeAgente
}

function formatearHora(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export default function MessagesCardClient({ mensaje }: Props) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] min-w-0 break-words rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3.5 py-2.5">
        <p className="text-sm leading-relaxed">{mensaje.texto}</p>
        <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">
          {formatearHora(mensaje.fecha)}
        </span>
      </div>
    </div>
  )
}