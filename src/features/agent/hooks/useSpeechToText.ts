'use client'

// Guardar en: src/features/agent/hooks/useSpeechToText.ts
//
// Graba audio del micrófono, lo resamplea a 16kHz mono (formato que
// requiere Whisper) y lo transcribe en un Web Worker aparte usando
// Transformers.js, sin depender de ninguna API del navegador ni backend.
import { useCallback, useRef, useState } from 'react'

export type EstadoVoz = 'inactivo' | 'grabando' | 'procesando'

export function useSpeechToText() {
  const [estado, setEstado] = useState<EstadoVoz>('inactivo')
  const workerRef = useRef<Worker | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const obtenerWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/whisper.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }
    return workerRef.current
  }, [])

  const detenerStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
  }

  const iniciarGrabacion = useCallback(async () => {
    try {
      obtenerWorker().postMessage({ tipo: 'cargar' })

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const grabador = new MediaRecorder(stream)
      grabador.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      grabador.start()
      mediaRecorderRef.current = grabador
      setEstado('grabando')
    } catch {
      setEstado('inactivo')
    }
  }, [obtenerWorker])

  const cancelarGrabacion = useCallback(() => {
    mediaRecorderRef.current?.stop()
    detenerStream()
    chunksRef.current = []
    setEstado('inactivo')
  }, [])

  const confirmarGrabacion = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const grabador = mediaRecorderRef.current
      if (!grabador) {
        setEstado('inactivo')
        resolve('')
        return
      }

      grabador.onstop = async () => {
        detenerStream()
        setEstado('procesando')

        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const arrayBuffer = await blob.arrayBuffer()
          const contextoDecod = new AudioContext()
          const bufferDecodificado = await contextoDecod.decodeAudioData(arrayBuffer)

          const contextoOffline = new OfflineAudioContext(
            1,
            Math.ceil(bufferDecodificado.duration * 16000),
            16000
          )
          const fuente = contextoOffline.createBufferSource()
          fuente.buffer = bufferDecodificado
          fuente.connect(contextoOffline.destination)
          fuente.start()
          const bufferResampleado = await contextoOffline.startRendering()
          const audio = bufferResampleado.getChannelData(0)

          const worker = obtenerWorker()
          const manejarMensaje = (evento: MessageEvent) => {
            const { tipo, texto } = evento.data
            if (tipo === 'resultado') {
              worker.removeEventListener('message', manejarMensaje)
              setEstado('inactivo')
              resolve(texto)
            } else if (tipo === 'error') {
              worker.removeEventListener('message', manejarMensaje)
              setEstado('inactivo')
              resolve('')
            }
          }
          worker.addEventListener('message', manejarMensaje)
          worker.postMessage({ tipo: 'transcribir', audio })
        } catch {
          setEstado('inactivo')
          resolve('')
        }
      }

      grabador.stop()
    })
  }, [obtenerWorker])

  return { estado, iniciarGrabacion, confirmarGrabacion, cancelarGrabacion }
}