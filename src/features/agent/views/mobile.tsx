'use client'

import { useAgent } from '@/src/features/agent/hooks/useAgent'
import Hero from '@/src/features/agent/components/layouts/shared/Hero'
import Core from '@/src/features/agent/components/layouts/shared/Core'

interface Props {
  slug: string
}

export default function AgentMobile({ slug }: Props) {
  const agent = useAgent(slug)

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="px-4 pt-5">
        <Hero
          nombre={agent.nombreAgente}
          activo={agent.agenteActivo}
          loading={agent.loading}
          onInfo={() => {}}
          onPerfil={() => {}}
        />
      </div>

      <Core agent={agent} />
    </div>
  )
}