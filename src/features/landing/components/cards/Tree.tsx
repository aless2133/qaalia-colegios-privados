import { Layers, FolderKanban, Coins } from 'lucide-react'
import type { LayoutVariant } from '../layouts/LandingOverview'
import Image from 'next/image'

interface TreeProps {
  variant: LayoutVariant
}

const ITEMS = [
  {
    src: '/assets/landing/tree/openrouter.webp',
    label: 'Infraestructura\nen OpenRouter',
  },
  {
    src: '/assets/landing/tree/next.webp',
    label: 'Desarrollado\ncon Next.js',
  },
  {
    src: '/assets/landing/tree/one_c.webp',
    label: 'Contexto por\nproyecto',
  },
]

export default function Tree({ variant }: TreeProps) {
  const desktop = variant === 'desktop'

  return (
    <div
      className={
        desktop
          ? 'flex items-start justify-center gap-28 -mt-10'
          : 'flex flex-col items-center gap-10'
      }
    >
      {ITEMS.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-40 h-40 rounded-full bg-background border-2 border-border flex items-center justify-center overflow-hidden">
            <Image src={item.src} alt={item.label} fill className="object-contain p-3" />
          </div>
          <p className={`font-extrabold uppercase text-foreground whitespace-pre-line ${desktop ? 'text-xl' : 'text-sm'}`}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}