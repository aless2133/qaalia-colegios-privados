'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'
import { Trash, AddCircle } from 'iconsax-react'

export default function Information({ informacion }: { informacion: any[] }) {
  const { crearInfo, eliminarInfo } = useAgentSettings()
  const [titulo, setTitulo] = useState('')
  const [detalles, setDetalles] = useState('')

  const handleAddInfo = () => {
    if (!detalles.trim()) return
    crearInfo(titulo, detalles)
    setTitulo('')
    setDetalles('')
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <h3 className="text-sm font-semibold text-foreground">Información del Negocio</h3>
        <p className="text-xs text-muted-foreground">Contexto exacto para que el agente sepa qué responder.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {informacion?.map(info => (
            <div key={info.id} className="flex flex-col gap-0 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-primary">{info.titulo || 'Información General'}</span>
                <Button variant="ghost" size="icon" onClick={() => eliminarInfo(info.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash size={14} color="currentColor" />
                </Button>
              </div>
              <p className="text-xs text-foreground whitespace-pre-wrap">{info.detalles}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashed border-border bg-background/50">
          <p className="text-xs font-semibold">Agregar nuevo bloque</p>
          <Input 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            placeholder="Título (opcional) Ej. Horarios" 
            className="h-9 text-xs"
          />
          <Textarea 
            value={detalles} 
            onChange={(e) => setDetalles(e.target.value)} 
            placeholder="Detalles (Obligatorio) Ej. Lunes a Viernes de 9am a 6pm" 
            className="min-h-[80px] text-xs resize-none"
          />
          <Button onClick={handleAddInfo} disabled={!detalles.trim()} className="w-full text-xs gap-2" variant="secondary">
            <AddCircle size={16} /> Agregar Información
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}