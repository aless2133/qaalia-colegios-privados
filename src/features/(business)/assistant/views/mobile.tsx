'use client'

import { useAssistant } from '@/src/features/(business)/assistant/hooks/useAssistant'
import Hero from '@/src/features/(business)/assistant/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/assistant/components/layouts/shared/Core'

export default function AssistantMobile() {
  const asis = useAssistant()

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-5">
        <Hero estado={asis.asistente?.estado ?? null} loading={asis.loading} />
        <Core asis={asis} />
      </div>
    </main>
  )
}