'use client'

import { Cpu } from 'iconsax-react'
import AgentCard from '@/src/features/(agent)/agent/components/cards/shared/AgentCard'
import type { MensajeAgente } from '@/src/features/(agent)/agent/hooks/useAgent'
import { useEffect, useState } from 'react'

interface Props {
  mensaje:      MensajeAgente
  escribiendo?: boolean
  fotoAgente?:  string | null
  nombreAgente?: string
}

function formatearHora(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export default function MessagesCardAgent({ mensaje, escribiendo, fotoAgente, nombreAgente }: Props) {
  const [textoAnimado, setTextoAnimado] = useState('')

  useEffect(() => {
    if (escribiendo) return

    setTextoAnimado('')
    let index = 0
    const interval = setInterval(() => {
      index++
      setTextoAnimado(mensaje.texto.slice(0, index))
      if (index >= mensaje.texto.length) {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [mensaje.texto, escribiendo])

  return (
    <div className="flex items-start gap-2 max-w-[98%]">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
        {fotoAgente ? (
          <img src={fotoAgente} alt={nombreAgente ?? 'Agente'} className="w-full h-full object-cover" />
        ) : (
          <Cpu size={14} color="currentColor" className="text-primary" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="px-1 py-2.5">
          {escribiendo ? (
            <div className="flex items-center gap-1 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground leading-relaxed">{textoAnimado}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">{formatearHora(mensaje.fecha)}</span>
            </>
          )}
        </div>

        {mensaje.productos && mensaje.productos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {mensaje.productos.map(p => <AgentCard key={p.id} producto={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}