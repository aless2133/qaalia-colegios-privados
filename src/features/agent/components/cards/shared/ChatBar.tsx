'use client'

import { useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Add, AddSquare, ArrowUp, ArrowUp2, ArrowUp3, Send2 } from 'iconsax-react'
import { ArrowUpIcon } from 'lucide-react'

interface Props {
  texto:     string
  setTexto:  (v: string) => void
  onEnviar:  () => void
  enviando:  boolean
  /** Variante grande y centrada (estado sin mensajes). Por defecto es la barra fija/slim. */
  centrado?: boolean
  onAbrirAcciones?: () => void
}

export default function ChatBar({ texto, setTexto, onEnviar, enviando, centrado = false, onAbrirAcciones}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-crecimiento del textarea según el contenido
  const ajustarAltura = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTexto(e.target.value)
    ajustarAltura()
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

  if (centrado) {
    return (
      <div
        onClick={enfocar}
        className="w-full rounded-[19px] border border-border bg-card/50 pl-2 pr-2 py-2 flex items-center gap-2 cursor-text
                   transition-all duration-200 ease-out
                   focus-within:-translate-y-0.5 focus-within:shadow-lg focus-within:border-primary/40"
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAbrirAcciones?.() }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
        >
          <AddSquare size={18} color="currentColor" className="text-muted-foreground" />
        </button>

        <textarea
          ref={textareaRef}
          value={texto}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="¿Cómo puedo ayudarte hoy?"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-border-foreground
                     focus:outline-none max-h-28 py-1"
        />

        <Button
          size="icon"
          onClick={handleEnviarClick}
          disabled={!texto.trim() || enviando}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-9 h-9 flex-shrink-0"
        >
          <ArrowUpIcon size={16} color="currentColor" />
        </Button>
      </div>
    )
  }

  return (
    <div
      onClick={enfocar}
      className="w-full rounded-[19px] border border-border bg-card/50 pl-2 pr-2 py-2 flex items-center gap-2 cursor-text
                 transition-all duration-200 ease-out
                 focus-within:-translate-y-0.5 focus-within:shadow-lg focus-within:border-primary/40"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onAbrirAcciones?.() }}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
      >
        <AddSquare size={18} color="currentColor" className="text-muted-foreground" />
      </button>

      <textarea
        ref={textareaRef}
        value={texto}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="¿Cómo puedo ayudarte hoy?"
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-border-foreground
                   focus:outline-none max-h-28 py-1"
      />

      <Button
        size="icon"
        onClick={handleEnviarClick}
        disabled={!texto.trim() || enviando}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-9 h-9 flex-shrink-0"
      >
        <ArrowUpIcon size={16} color="currentColor" />
      </Button>
    </div>
  )
}