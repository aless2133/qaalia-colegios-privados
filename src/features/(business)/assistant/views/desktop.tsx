'use client'

import { useAssistant } from '@/src/features/(business)/assistant/hooks/useAssistant'
import Hero from '@/src/features/(business)/assistant/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/assistant/components/layouts/shared/Core'

export default function AssistantDesktop() {
  const asis = useAssistant()

  return (
    <main className="px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Hero estado={asis.asistente?.estado ?? null} loading={asis.loading} />
        <Core asis={asis} />
      </div>
    </main>
  )
}