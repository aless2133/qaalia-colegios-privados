'use client'

import Hero from '@/src/features/(business)/AgentSettings/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/AgentSettings/components/layouts/shared/Core'

export default function AgentSettingsMobile() {
  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-6">
        <Hero />
        <Core />
      </div>
    </main>
  )
}