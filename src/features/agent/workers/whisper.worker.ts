// Guardar en: src/features/agent/workers/whisper.worker.ts
//
// Corre el modelo Whisper 100% en el navegador vía Transformers.js, dentro
// de un Web Worker para no congelar la UI mientras se descarga el modelo
// (primera vez, se cachea en IndexedDB) o mientras se transcribe.
import { pipeline } from '@huggingface/transformers'

// Modelo multilingüe (soporta español). "base" es buen balance calidad/peso.
// Si se necesita más velocidad: 'onnx-community/whisper-tiny'
// Si se necesita más precisión: 'onnx-community/whisper-small'
const MODELO = 'onnx-community/whisper-base'

let transcriptorPromise: Promise<any> | null = null

function obtenerTranscriptor() {
  if (!transcriptorPromise) {
    transcriptorPromise = pipeline('automatic-speech-recognition', MODELO, {
      device: 'wasm',
      dtype: 'q8',
    })
  }
  return transcriptorPromise
}

self.onmessage = async (evento: MessageEvent) => {
  const { tipo } = evento.data

  if (tipo === 'cargar') {
    try {
      await obtenerTranscriptor()
      self.postMessage({ tipo: 'listo' })
    } catch (error) {
      self.postMessage({ tipo: 'error', mensaje: (error as Error).message })
    }
    return
  }

  if (tipo === 'transcribir') {
    try {
      const transcriptor = await obtenerTranscriptor()
      const resultado = await transcriptor(evento.data.audio, {
        language: 'spanish',
        task: 'transcribe',
      })
      const texto = Array.isArray(resultado) ? resultado[0]?.text : resultado.text
      self.postMessage({ tipo: 'resultado', texto: (texto ?? '').trim() })
    } catch (error) {
      self.postMessage({ tipo: 'error', mensaje: (error as Error).message })
    }
  }
}