'use client'

import Hero from '@/src/features/(business)/AgentSettings/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/AgentSettings/components/layouts/shared/Core'

export default function AgentSettingsDesktop() {
  return (
    <main className="px-10 py-4">
      <div className="max-w-8xl flex flex-col gap-8">
        <Hero />
        <Core />
      </div>
    </main>
  )
}