'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, AddCircle, Trash, Whatsapp, Sms, MessageQuestion } from 'iconsax-react'
import type { useShares, TipoMetodoContacto } from '@/src/features/(business)/shares/hooks/useShares'

interface NewProposalProps {
  sh: ReturnType<typeof useShares>
}

const METODO_LABEL: Record<TipoMetodoContacto, string> = {
  whatsapp_telefono: 'WhatsApp',
  correo:            'Correo',
  otro:              'Otro',
}

export default function NewProposal({ sh }: NewProposalProps) {
  const {
    nuevoTitulo, setNuevoTitulo,
    nuevaDescripcion, setNuevaDescripcion,
    nuevasPreguntas, agregarPreguntaNueva, actualizarPreguntaNueva, eliminarPreguntaNueva,
    agregarOpcionNueva, eliminarOpcionNueva,
    nuevosMetodos, agregarMetodoNuevo, actualizarMetodoNuevo, eliminarMetodoNuevo,
    activarAlCrear, setActivarAlCrear,
    crearPropuestaCompleta, guardandoNueva, errorNueva,
    cerrarNuevo,
  } = sh

  const [textoOpcion, setTextoOpcion] = useState<Record<string, string>>({})

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header fijo */}
     <div className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 lg:px-0 py-4 flex items-center justify-between gap-3">
          <button
            onClick={cerrarNuevo}
            disabled={guardandoNueva}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <ArrowLeft size={20} color="currentColor" />
          </button>
          <h1 className="text-base font-bold text-foreground">Nueva actividad</h1>
          <Button
            size="sm"
            className="rounded-2xl font-bold"
            onClick={() => crearPropuestaCompleta()}
            disabled={guardandoNueva}
          >
            {guardandoNueva ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
        <div className="max-w-2xl mx-auto px-8">
          <div className="border-b border-border" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 lg:px-0 py-6 flex flex-col gap-8 pb-24">

        {/* Datos básicos */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-foreground">Datos de la actividad</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Título</label>
            <Input
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              placeholder="Ej. Solicitar proyecto de software"
              className="rounded-2xl bg-card"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
              <span className="text-[11px] text-muted-foreground">{nuevaDescripcion.length}/120</span>
            </div>
            <Textarea
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value.slice(0, 120))}
              placeholder="Cuéntale al cliente para qué sirve esta actividad"
              className="rounded-2xl bg-card resize-none"
              rows={3}
            />
          </div>
        </section>

        {/* Preguntas */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Preguntas al cliente</h2>
            <button
              onClick={agregarPreguntaNueva}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
            >
              <AddCircle size={16} color="currentColor" />
              Agregar
            </button>
          </div>

          {nuevasPreguntas.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Opcional. Agrega preguntas para pedirle detalles al cliente sobre su solicitud.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {nuevasPreguntas.map((pregunta, idx) => (
              <div key={pregunta.tempId} className="rounded-2xl border border-border bg-card p-3.5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">Pregunta {idx + 1}</span>
                  <button
                    onClick={() => eliminarPreguntaNueva(pregunta.tempId)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Trash size={14} color="currentColor" className="text-destructive" />
                  </button>
                </div>

                <Input
                  value={pregunta.titulo}
                  onChange={(e) => actualizarPreguntaNueva(pregunta.tempId, { titulo: e.target.value })}
                  placeholder="Título de la pregunta"
                  className="rounded-xl bg-background"
                />
                <Input
                  value={pregunta.descripcion}
                  onChange={(e) => actualizarPreguntaNueva(pregunta.tempId, { descripcion: e.target.value })}
                  placeholder="Descripción corta (opcional)"
                  className="rounded-xl bg-background"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => actualizarPreguntaNueva(pregunta.tempId, { tipo: 'abierta' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      pregunta.tipo === 'abierta'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-muted-foreground'
                    }`}
                  >
                    Respuesta abierta
                  </button>
                  <button
                    onClick={() => actualizarPreguntaNueva(pregunta.tempId, { tipo: 'cerrada' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      pregunta.tipo === 'cerrada'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-muted-foreground'
                    }`}
                  >
                    Opción múltiple
                  </button>
                </div>

                {pregunta.tipo === 'cerrada' && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
                    {pregunta.opciones.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pregunta.opciones.map((opcion, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] gap-1">
                            {opcion}
                            <button onClick={() => eliminarOpcionNueva(pregunta.tempId, i)}>
                              <Trash size={10} color="currentColor" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Input
                      value={textoOpcion[pregunta.tempId] ?? ''}
                      onChange={(e) => setTextoOpcion(prev => ({ ...prev, [pregunta.tempId]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          agregarOpcionNueva(pregunta.tempId, textoOpcion[pregunta.tempId] ?? '')
                          setTextoOpcion(prev => ({ ...prev, [pregunta.tempId]: '' }))
                        }
                      }}
                      placeholder="Escribe una opción y presiona Enter"
                      className="rounded-xl bg-background text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Métodos de contacto */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-foreground">¿Cómo te contactamos?</h2>
          <p className="text-xs text-muted-foreground">
            Elige al menos un método para poder activar la actividad.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => agregarMetodoNuevo('whatsapp_telefono')}
              disabled={nuevosMetodos.some(m => m.tipo === 'whatsapp_telefono') || nuevosMetodos.length >= 6}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              <Whatsapp size={14} color="currentColor" /> WhatsApp
            </button>
            <button
              onClick={() => agregarMetodoNuevo('correo')}
              disabled={nuevosMetodos.some(m => m.tipo === 'correo') || nuevosMetodos.length >= 6}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              <Sms size={14} color="currentColor" /> Correo
            </button>
            <button
              onClick={() => agregarMetodoNuevo('otro')}
              disabled={nuevosMetodos.length >= 6}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              <MessageQuestion size={14} color="currentColor" /> Otro
            </button>
          </div>

          {nuevosMetodos.length > 0 && (
           <div className="grid grid-cols-2 gap-2">
              {nuevosMetodos.map(metodo => (
                <div key={metodo.tempId} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
                  <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                    {METODO_LABEL[metodo.tipo]}
                  </Badge>
                  {metodo.tipo === 'otro' && (
                    <Input
                      value={metodo.etiqueta}
                      onChange={(e) => actualizarMetodoNuevo(metodo.tempId, e.target.value)}
                      placeholder="Nombre del método (ej. Cédula)"
                      className="rounded-xl bg-background text-xs h-8 flex-1"
                    />
                  )}
                  <button
                    onClick={() => eliminarMetodoNuevo(metodo.tempId)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0 ml-auto"
                  >
                    <Trash size={14} color="currentColor" className="text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activar al guardar */}
        <section className="flex items-center justify-between rounded-2xl border border-border p-3.5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Activar al guardar</span>
            <span className="text-[11px] text-muted-foreground">
              Se mostrará de inmediato en tu enlace único.
            </span>
          </div>
          <Switch checked={activarAlCrear} onCheckedChange={setActivarAlCrear} />
        </section>

        {errorNueva && (
          <p className="text-xs font-medium text-destructive text-center">{errorNueva}</p>
        )}
      </div>
    </div>
  )
}