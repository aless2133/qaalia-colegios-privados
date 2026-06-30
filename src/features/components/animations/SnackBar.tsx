'use client'

import { TickCircle, CloseCircle } from 'iconsax-react'
import { useEffect, useState } from 'react'

interface SnackbarProps {
  mostrar: boolean
  mensaje: string
  tipo?: 'exito' | 'error'
  onOcultar: () => void
  duracion?: number
}

export default function Snackbar({
  mostrar,
  mensaje,
  tipo = 'exito',
  onOcultar,
  duracion = 3000,
}: SnackbarProps) {
  const [visible, setVisible]   = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    if (!mostrar) return
    setVisible(true)
    setSaliendo(false)

    const timerSalida = setTimeout(() => {
      setSaliendo(true)
      setTimeout(() => {
        setVisible(false)
        onOcultar()
      }, 320)
    }, duracion)

    return () => clearTimeout(timerSalida)
  }, [mostrar])

  if (!visible) return null

  const esExito = tipo === 'exito'

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-[200] flex justify-center px-5 ${saliendo ? 'snackbar-exit' : 'snackbar-enter'}`}
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 14px)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3 rounded-3xl bg-card border border-border shadow-lg"
          style={{ pointerEvents: 'auto' }}
        >
          {esExito
            ? <TickCircle size={16} color="currentColor" variant="Bold" className="text-success" />
            : <CloseCircle size={16} color="currentColor" variant="Bold" className="text-destructive" />
          }
          <span className="text-sm font-semibold text-foreground">{mensaje}</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes snackbar-in {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes snackbar-out {
          from { opacity: 1; transform: translateY(0);     }
          to   { opacity: 0; transform: translateY(-18px); }
        }
        .snackbar-enter { animation: snackbar-in  0.32s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .snackbar-exit  { animation: snackbar-out 0.28s ease-in forwards;                        }
      `}</style>
    </>
  )
}