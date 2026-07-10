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
}

export default function ChatBar({ texto, setTexto, onEnviar, enviando, centrado = false }: Props) {
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

  // Clic en cualquier parte de la barra enfoca el textarea (más tolerante que solo el textarea)
  const enfocar = () => textareaRef.current?.focus()

  if (centrado) {
    return (
      <div
        onClick={enfocar}
        className="w-full rounded-3xl border border-border bg-card px-4 pt-3.5 pb-3 flex flex-col gap-2 cursor-text
                   transition-all duration-200 ease-out
                   focus-within:-translate-y-1 focus-within:shadow-lg focus-within:border-primary/40"
      >
        <textarea
          ref={textareaRef}
          value={texto}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground
                     focus:outline-none min-h-[48px] max-h-40"
        />
        <div className="flex justify-end">
          <Button
            size="icon"
            onClick={handleEnviarClick}
            disabled={!texto.trim() || enviando}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-9 h-9"
          >
            <Send2 size={16} color="currentColor" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={enfocar}
      className="w-full rounded-full border border-border bg-accent/50 pl-2 pr-2 py-2 flex items-center gap-2 cursor-text
                 transition-all duration-200 ease-out
                 focus-within:-translate-y-0.5 focus-within:shadow-lg focus-within:border-primary/40"
    >
      <button
        type="button"
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
      >
        <AddSquare size={18} color="currentColor" className="text-muted-foreground" />
      </button>

      <textarea
        ref={textareaRef}
        value={texto}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground
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