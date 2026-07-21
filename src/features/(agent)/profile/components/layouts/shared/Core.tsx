'use client'

import type { useProfile } from '@/src/features/(agent)/profile/hooks/useProfile'
import ProfileCard from '@/src/features/(agent)/profile/components/cards/shared/ProfileCard'
import DetailsCard from '@/src/features/(agent)/profile/components/cards/shared/DetailsCard'

interface CoreProps {
  pr: ReturnType<typeof useProfile>
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-accent animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-1/2 rounded bg-accent animate-pulse" />
          <div className="h-2.5 w-1/3 rounded bg-accent animate-pulse" />
        </div>
      </div>

      <div className="rounded-2xl border border-border p-4 flex flex-col gap-3">
        <div className="h-2.5 w-full rounded bg-accent animate-pulse" />
        <div className="h-2.5 w-3/4 rounded bg-accent animate-pulse" />
        <div className="h-2.5 w-2/3 rounded bg-accent animate-pulse" />
      </div>
    </div>
  )
}

export default function Core({ pr }: CoreProps) {
  const { loading, negocio, agente, actividades, loadingActividades, error } = pr

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error || !negocio) {
    return (
      <div className="rounded-2xl border border-border p-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground">
          {error || 'No se pudo cargar el perfil del negocio'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <ProfileCard negocio={negocio} />
      <DetailsCard
        agente={agente}
        actividades={actividades}
        loadingActividades={loadingActividades}
      />
    </div>
  )
}