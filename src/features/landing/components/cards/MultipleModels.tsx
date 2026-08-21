import Image from 'next/image'
import { Card, CardContent } from '@/components/landing/card'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface MultipleModelsProps {
  variant: LayoutVariant
}

const MODELS = [
  { name: 'GPT', src: '/assets/landing/models/gpt_dos.webp' },
  { name: 'Gemini', src: '/assets/landing/models/gemini_dos.webp' },
  { name: 'Claude', src: '/assets/landing/models/claude_dos.webp' },
  { name: 'Grok', src: '/assets/landing/models/grok.webp' },
  { name: 'DeepSeek', src: '/assets/landing/models/deepseek.webp' },
  { name: 'Qwen', src: '/assets/landing/models/qwen.webp' },
]

export default function MultipleModels({ variant }: MultipleModelsProps) {
  const desktop = variant === 'desktop'

  return (
    <div className="flex flex-col items-center text-center gap-3 -mt-12">
      <h2 className={`font-extrabold text-foreground leading-tight ${desktop ? 'text-[45px]' : 'text-3xl'}`}>
        Múltiples modelos, un solo lugar
      </h2>
      <p className={`text-foreground max-w-[1084px] ${desktop ? 'text-[22px]' : 'text-base'}`}> 
        Trabaja con los modelos de IA más potentes sin perder el contexto de tu proyecto
      </p>

      <div
        className={
          desktop
            ? 'flex items-center justify-center gap-8 mt-8'
            : 'grid grid-cols-2 gap-4 mt-8'
        }
      >
        {MODELS.map((model) => (
          <Card
            key={model.name}
            className={`bg-background border-2 border-border flex flex-col ${
              desktop ? 'w-45 h-50' : 'w-full h-44'
            }`}
          >
            <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
              <div className="relative w-28 h-28">
                <Image src={model.src} alt={model.name} fill className="object-contain" />
              </div>
             <p className={`font-extrabold text-foreground ${desktop ? 'text-xl -mt-1' : 'text-sm -mt-3'}`}>{model.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}