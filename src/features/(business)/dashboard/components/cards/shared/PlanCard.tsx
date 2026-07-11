'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown1, ArrowRight2 } from 'iconsax-react'
import { useRouter } from 'next/navigation'

interface Props {
  onPress?: () => void
}

export default function PlanCard({ onPress }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (onPress) { onPress(); return }
    router.push('/plan')
  }

  return (
    <Card className="bg-primary/5 border border-primary/20 overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-black text-primary">
            Mejora tu negocio
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1 leading-snug">
            Branding completo, agente sin límites, más acciones y soporte prioritario para tu negocio.
          </p>
          <Button
            size="sm"
            onClick={handleClick}
            className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-1"
          >
            Ver opciones
            <ArrowRight2 size={14} color="currentColor" />
          </Button>
        </div>

        <div className="w-[72px] h-[72px] rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Crown1 size={32} color="currentColor" className="text-primary" variant="Bold" />
        </div>
      </CardContent>
    </Card>
  )
}