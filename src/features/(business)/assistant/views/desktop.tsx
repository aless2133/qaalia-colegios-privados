'use client'

import { useAssistant } from '@/src/features/(business)/assistant/hooks/useAssistant'
import Hero from '@/src/features/(business)/assistant/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/assistant/components/layouts/shared/Core'

export default function AssistantDesktop() {
  const asis = useAssistant()

  return (
    <main className="px-10 py-4">
      <div className="max-w-8xl flex flex-col gap-4">
        <Hero estado={asis.asistente?.estado ?? null} loading={asis.loading} />
        <Core asis={asis} />
      </div>
    </main>
  )
}