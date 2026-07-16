'use client'

import { Warning2 } from 'iconsax-react'
import { useEffect, useState } from 'react'

export default function NoData() {
  const textoTitulo = 'Este negocio no existe o el enlace es inválido'
  const textoSubtitulo = 'Verifica que el enlace esté escrito correctamente.'
  const textoCompleto = textoTitulo + textoSubtitulo
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    setIndice(0)
    let index = 0
    const interval = setInterval(() => {
      index++
      setIndice(index)
      if (index >= textoCompleto.length) {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  const tituloAnimado = textoTitulo.slice(0, indice)
  const subtituloAnimado = textoSubtitulo.slice(0, Math.max(0, indice - textoTitulo.length))

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-[40px] bg-accent flex items-center justify-center mb-4">
        <Warning2 size={28} color="currentColor" className="text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        {tituloAnimado}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        {subtituloAnimado}
      </p>
    </div>
  )
}