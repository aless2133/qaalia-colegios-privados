'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Envuelve el reconocimiento de voz nativo del navegador (Web Speech API)
// para convertir lo que dice el usuario en texto dentro del ChatBar. No
// depende de ningún backend ni paquete externo: usa el motor que ya trae
// Chrome/Safari. En navegadores sin soporte (Firefox, algunos WebView de
// iOS) `soportado` queda en false para que el botón de micrófono se pueda
// ocultar en vez de mostrar un error.
export function useSpeechToText(onTranscripcion: (texto: string) => void) {
  const [escuchando, setEscuchando] = useState(false)
  const [soportado, setSoportado] = useState(false)
  const reconocimientoRef = useRef<any>(null)
  const textoBaseRef = useRef('')
  const finalTranscriptRef = useRef('')
  const detencionManualRef = useRef(false)

  useEffect(() => {
    const Motor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSoportado(!!Motor)
  }, [])

  const detener = useCallback(() => {
    detencionManualRef.current = true
    reconocimientoRef.current?.stop()
  }, [])

  const alternar = useCallback((textoActual: string) => {
    const Motor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!Motor) return

    if (escuchando) {
      detener()
      return
    }

   const reconocimiento = new Motor()
    reconocimiento.lang = 'es-EC'
    reconocimiento.continuous = false
    reconocimiento.interimResults = true

    textoBaseRef.current = textoActual ? `${textoActual} ` : ''
    finalTranscriptRef.current = ''
    detencionManualRef.current = false

    reconocimiento.onresult = (evento: any) => {
      const resultado = evento.results[evento.results.length - 1]
      const transcripcion = resultado[0].transcript

      if (resultado.isFinal) {
        finalTranscriptRef.current += `${transcripcion} `
        onTranscripcion(`${textoBaseRef.current}${finalTranscriptRef.current}`)
      } else {
        onTranscripcion(`${textoBaseRef.current}${finalTranscriptRef.current}${transcripcion}`)
      }
    }

    reconocimiento.onerror = () => {
      detencionManualRef.current = true
      setEscuchando(false)
    }

    reconocimiento.onend = () => {
      if (detencionManualRef.current) {
        setEscuchando(false)
        return
      }
      reconocimiento.start()
    }

    reconocimientoRef.current = reconocimiento
    reconocimiento.start()
    setEscuchando(true)
  }, [escuchando, detener, onTranscripcion])

  useEffect(() => {
    return () => {
      detencionManualRef.current = true
      reconocimientoRef.current?.stop()
    }
  }, [])

  return { escuchando, soportado, alternar }
}