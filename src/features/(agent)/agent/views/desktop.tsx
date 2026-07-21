'use client'

import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import Core from '@/src/features/(agent)/agent/components/layouts/shared/Core'
import NoData from '@/src/features/(agent)/agent/components/sections/shared/NoData'
interface Props {
  slug: string
}

export default function AgentDesktop({ slug }: Props) {
  const agent = useAgent(slug)

  if (!agent.loading && agent.error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
        <NoData />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Core agent={agent} />
    </div>
  )
}