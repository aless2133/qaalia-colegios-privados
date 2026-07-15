'use client'

import type { useAgent } from '@/src/features/agent/hooks/useAgent'
import MessagesCardAgent  from '@/src/features/agent/components/cards/shared/MessagesCardAgent'
import MessagesCardClient from '@/src/features/agent/components/cards/shared/MessagesCardClient'
import ChatBar            from '@/src/features/agent/components/cards/shared/ChatBar'
import EmptyAgents        from '@/src/features/agent/components/sections/shared/EmptyAgents'
import { useEffect, useRef, useState } from 'react'
import ActionsModal from '@/src/features/agent/components/modals/shared/ActionsModal'
import { useStickyFooter } from '@/src/features/agent/hooks/useStickyFooter'
interface CoreProps {
  agent: ReturnType<typeof useAgent>
}

export default function Core({ agent }: CoreProps) {
  const {
    mensajes, loading, nombreAgente, acciones,
    seleccionarAccion, enviando, texto, setTexto, enviarMensaje,
  } = agent

  const [mostrarAcciones, setMostrarAcciones] = useState(false)
  const hayMensajes = mensajes.length > 0
  const handleEnviar = () => enviarMensaje(texto)

    // Ancla invisible al final del flujo de mensajes: cada vez que se envía
  // (mensajes.length cambia) o el agente empieza/termina de "escribir"
  // (enviando cambia), se hace scroll suave hasta ella.
  const finRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes.length, enviando])

  const footerRef = useRef<HTMLDivElement>(null)
  useStickyFooter(footerRef)

  // Estado inicial: sin mensajes -> todo centrado verticalmente en pantalla
  if (!hayMensajes) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-38 gap-5">
        {!loading && <EmptyAgents nombreAgente={nombreAgente} fotoAgente={agent.fotoAgente}/>}
        <div className="w-full max-w-xl flex flex-col gap-3 relative">
          <ActionsModal
            mostrar={mostrarAcciones}
            onCerrar={() => setMostrarAcciones(false)}
            acciones={acciones}
            onSeleccionar={seleccionarAccion}
          />

          <ChatBar
            texto={texto}
            setTexto={setTexto}
            onEnviar={handleEnviar}
            enviando={enviando}
            centrado
            onAbrirAcciones={() => setMostrarAcciones(true)}
          />
        </div>
      </div>
    )
  }

  // Estado activo: mensajes en flujo normal (la página scrollea de forma nativa)
  // y la barra queda "sticky" al fondo del viewport -> no usa fixed/h-[100dvh] calculado,
  // por eso no se pierde cuando el navegador oculta/muestra su barra superior.
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col gap-3 px-3 py-4 lg:max-w-2xl lg:mx-auto lg:w-full">
        {mensajes.map(m =>
          m.rol === 'cliente'
            ? <MessagesCardClient key={m.id} mensaje={m} />
            : <MessagesCardAgent  key={m.id} mensaje={m} fotoAgente={agent.fotoAgente} nombreAgente={nombreAgente} />
        )}

        {enviando && (
          <MessagesCardAgent
            mensaje={{ id: 'typing', rol: 'agente', texto: '', fecha: new Date().toISOString() }}
            escribiendo
            fotoAgente={agent.fotoAgente}
            nombreAgente={nombreAgente}
          />
        )}
        <div ref={finRef} className="h-px scroll-mb-28" />
      </div>

    <div ref={footerRef} className="bg-background pt-1 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="relative lg:max-w-2xl lg:mx-auto flex flex-col gap-2">
          <ActionsModal
            mostrar={mostrarAcciones}
            onCerrar={() => setMostrarAcciones(false)}
            acciones={acciones}
            onSeleccionar={seleccionarAccion}
          />

          <ChatBar
            texto={texto}
            setTexto={setTexto}
            onEnviar={handleEnviar}
            enviando={enviando}
            onAbrirAcciones={() => setMostrarAcciones(true)}
          />
        </div>
      </div>
    </div>
  )
}