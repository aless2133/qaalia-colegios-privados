'use client'

import { useAgent } from '@/src/features/agent/hooks/useAgent'
import Navbar from '@/src/features/agent/components/layouts/shared/Navbar'
import Core from '@/src/features/agent/components/layouts/shared/Core'

interface Props {
  slug: string
}

export default function AgentMobile({ slug }: Props) {
  const agent = useAgent(slug)

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
     <Navbar nombreNegocio={agent.nombreAgente} loading={agent.loading} />
      <Core agent={agent} />
    </div>
  )
}