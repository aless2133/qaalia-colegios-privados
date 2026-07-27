'use client'

import Marca from '@/src/features/(business)/AgentSettings/components/cards/shared/Marca'
import Behavior from '@/src/features/(business)/AgentSettings/components/cards/shared/behavior'
import Information from '@/src/features/(business)/AgentSettings/components/cards/shared/information'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'

export default function Core() {
  const { agente, isLoading } = useAgentSettings()

  if (isLoading) return <div className="animate-pulse h-32 bg-accent rounded-xl"></div>
  if (!agente) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="flex flex-col gap-6">
        <Marca marca={agente.marca} descripcion={agente.descripcion} />
        <Behavior personalidad={agente.personalidad} reglas={agente.reglas} />
      </div>
      <div className="flex flex-col gap-6">
      <Information informacion={agente.informacion} acciones={agente.acciones} />
      </div>
    </div>
  )
}