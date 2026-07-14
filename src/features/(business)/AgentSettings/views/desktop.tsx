'use client'

import Hero from '@/src/features/(business)/AgentSettings/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/AgentSettings/components/layouts/shared/Core'

export default function AgentSettingsDesktop() {
  return (
    <main className="px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <Hero />
        <Core />
      </div>
    </main>
  )
}