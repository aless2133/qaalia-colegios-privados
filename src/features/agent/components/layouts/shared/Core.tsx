'use client'

import type { useAgent } from '@/src/features/agent/hooks/useAgent'
import MessagesCardAgent  from '@/src/features/agent/components/cards/shared/MessagesCardAgent'
import MessagesCardClient from '@/src/features/agent/components/cards/shared/MessagesCardClient'
import SharesOption       from '@/src/features/agent/components/cards/shared/ShareOptions'
import ChatBar            from '@/src/features/agent/components/cards/shared/ChatBar'
import EmptyAgents        from '@/src/features/agent/components/sections/shared/EmptyAgents'
import { useState } from 'react'
import ActionsModal from '@/src/features/agent/components/modals/shared/ActionsModal'

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

  // Estado inicial: sin mensajes -> todo centrado verticalmente en pantalla
  if (!hayMensajes) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-5">
        {!loading && <EmptyAgents nombreAgente={nombreAgente} />}

        <div className="w-full max-w-xl flex flex-col gap-3">
          <ChatBar
            texto={texto}
            setTexto={setTexto}
            onEnviar={handleEnviar}
            enviando={enviando}
            centrado
          />
          <SharesOption acciones={acciones} onSeleccionar={seleccionarAccion} variant="wrap" />
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
            : <MessagesCardAgent  key={m.id} mensaje={m} />
        )}

        {enviando && (
          <MessagesCardAgent
            mensaje={{ id: 'typing', rol: 'agente', texto: '', fecha: new Date().toISOString() }}
            escribiendo
          />
        )}
      </div>

    <div className="sticky bottom-0 bg-background pt-1 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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