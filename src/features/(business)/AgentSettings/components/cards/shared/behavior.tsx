'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'
import { Trash, Add } from 'iconsax-react'

export default function Behavior({ personalidad, reglas }: { personalidad: string, reglas: any[] }) {
  const { actualizarPersonalidad, crearRegla, eliminarRegla } = useAgentSettings()
  const [pers, setPers] = useState(personalidad)
  const [nuevaRegla, setNuevaRegla] = useState('')

  const handleAddRegla = () => {
    if (!nuevaRegla.trim()) return
    crearRegla(nuevaRegla)
    setNuevaRegla('')
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <h3 className="text-sm font-semibold text-foreground">Comportamiento</h3>
        <p className="text-xs text-muted-foreground">Define cómo habla y qué reglas debe seguir.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-foreground">Personalidad</label>
          <Textarea 
            value={pers} 
            onChange={(e) => setPers(e.target.value)}
            className="min-h-[120px] text-sm resize-none bg-background"
          />
          <Button onClick={() => actualizarPersonalidad(pers)} variant="outline" size="sm" className="mt-1 w-fit">
            Actualizar Personalidad
          </Button>
        </div>
        
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-foreground">Reglas de Operación</label>
          <div className="flex flex-col gap-2">
            {reglas?.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent border border-border">
                <p className="text-xs flex-1 text-foreground">{r.regla}</p>
                <Button variant="ghost" size="icon" onClick={() => eliminarRegla(r.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash size={16} color="currentColor" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Input 
              value={nuevaRegla} 
              onChange={(e) => setNuevaRegla(e.target.value)}
              placeholder="Ej. Nunca dar descuentos sin autorización" 
              className="h-10 text-xs bg-background"
            />
            <Button onClick={handleAddRegla} size="icon" className="h-10 w-10 shrink-0">
              <Add size={20} color="currentColor" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}