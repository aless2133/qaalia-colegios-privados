import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import { useViewportHeight } from '@/src/features/(agent)/agent/hooks/useViewportHeight'
import Core from '@/src/features/(agent)/agent/components/layouts/shared/Core'
import NoData from '@/src/features/(agent)/agent/components/sections/shared/NoData'
interface Props {
  slug: string
}

export default function AgentMobile({ slug }: Props) {
  const agent = useAgent(slug)
  useViewportHeight()

  if (!agent.loading && agent.error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
        <NoData />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: 'var(--app-vh, 100dvh)' }}>
      <Core agent={agent} />
    </div>
  )
}