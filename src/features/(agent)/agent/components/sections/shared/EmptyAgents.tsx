'use client'

import { Cpu } from 'iconsax-react'
import { useEffect, useState } from 'react'

interface Props {
  nombreAgente: string
  fotoAgente?: string | null
  mensajeBienvenida?: string | null
}

export default function EmptyAgents({ nombreAgente, fotoAgente, mensajeBienvenida }: Props) {
  const textoCompleto =
    mensajeBienvenida?.trim() ||
    'Pregunta lo que quieras y te responderé con la información disponible en este momento.'
  const [textoAnimado, setTextoAnimado] = useState('')

  useEffect(() => {
    setTextoAnimado('')
    let index = 0
    const interval = setInterval(() => {
      index++
      setTextoAnimado(textoCompleto.slice(0, index))
      if (index >= textoCompleto.length) {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-26 h-26 rounded-[80px] bg-accent flex items-center justify-center mb-6 overflow-hidden">
        {fotoAgente ? (
          <img src={fotoAgente} alt={nombreAgente} className="w-full h-full object-cover" />
        ) : (
          <Cpu size={28} color="currentColor" className="text-primary" />
        )}
      </div>
      <p className="text-lg font-semibold text-foreground">
        ¡Hola! Soy {nombreAgente}
      </p>
      <p className="text-sm text-muted-foreground mt-1 max-w-[278px]">
        {textoAnimado}
      </p>
    </div>
  )
}