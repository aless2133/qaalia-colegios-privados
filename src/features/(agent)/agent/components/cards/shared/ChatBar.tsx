'use client'

import { useEffect, useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { AddSquare, Microphone, Microphone2 } from 'iconsax-react'
import { ArrowUpIcon } from 'lucide-react'
import { useSpeechToText } from '@/src/features/(agent)/agent/hooks/useSpeechToText'
interface Props {
  texto:     string
  setTexto:  (v: string) => void
  onEnviar:  () => void
  enviando:  boolean
  centrado?: boolean
  onAbrirAcciones?: () => void
  onAbrirVoz?: () => void
}

const MAX_LINEAS = 9

export default function ChatBar({ texto, setTexto, onEnviar, enviando, centrado = false, onAbrirAcciones, onAbrirVoz }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const { escuchando, soportado, alternar } = useSpeechToText(setTexto)

  const ajustarAltura = () => {
    const el = textareaRef.current
    const contenedor = contenedorRef.current
    if (!el) return

    el.style.height = 'auto'

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20')
    const alturaMaxima = lineHeight * MAX_LINEAS
    const alturaNueva = Math.min(el.scrollHeight, alturaMaxima)

    el.style.height = `${alturaNueva}px`
    el.style.overflowY = el.scrollHeight > alturaMaxima ? 'auto' : 'hidden'

    if (contenedor) {
      const alturaPrevia = contenedor.getBoundingClientRect().height
      contenedor.style.height = `${alturaPrevia}px`
      void contenedor.offsetHeight

      contenedor.style.height = 'auto'
      const alturaObjetivo = contenedor.scrollHeight
      contenedor.style.height = `${alturaPrevia}px`
      void contenedor.offsetHeight

      contenedor.style.height = `${alturaObjetivo}px`
    }
  }

  useEffect(() => {
    ajustarAltura()
  }, [texto])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTexto(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (texto.trim()) onEnviar()
    }
  }

  const handleEnviarClick = () => {
    if (texto.trim()) onEnviar()
  }

  const enfocar = () => textareaRef.current?.focus()

  return (
    <div
      ref={contenedorRef}
      onClick={enfocar}
      className="w-full rounded-[19px] border border-border/50 lg:border-foreground/20 lg:dark:border-border/50 bg-background dark:bg-card px-2 pt-2.5 pb-2 flex flex-col cursor-text shadow-lg lg:shadow-2xl lg:dark:shadow-lg overflow-hidden
                 transition-all duration-200 ease-out
                 focus-within:-translate-y-0.5"
    >
      <textarea
        ref={textareaRef}
        value={texto}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="¿Cómo puedo ayudarte hoy?"
        rows={1}
        className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-border-foreground
                   focus:outline-none px-1 pb-2 transition-[height] duration-150 ease-out hide-scrollbar"
      />

      {/* Sección inferior: acciones */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAbrirAcciones?.() }}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-border/50 lg:bg-foreground/10 lg:dark:bg-border/50 hover:bg-muted transition-colors"
        >
          <AddSquare size={18} color="currentColor" className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-1.5">
         {soportado && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); alternar(texto) }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-border/50 lg:bg-foreground/10 lg:dark:bg-border/50 hover:bg-muted transition-colors"
            >
              <Microphone2 size={18} color="currentColor" variant={escuchando ? 'Bold' : 'Linear'} className={escuchando ? 'text-primary' : 'text-muted-foreground'} />
            </button>
          )}

          <Button
            size="icon"
            onClick={handleEnviarClick}
            disabled={!texto.trim() || enviando}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-9 h-9 flex-shrink-0"
          >
            <ArrowUpIcon size={16} color="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  )
}