import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import mammoth from 'mammoth'
// unpdf: alternativa moderna a pdf-parse, sin dependencias nativas y hecha
// para entornos serverless/Next.js — no tiene el bug de ENOENT de pdf-parse.
import { extractText, getDocumentProxy } from 'unpdf'
export const runtime = 'nodejs'

// Service role: necesario porque documentos-agentes es un bucket privado y
// este proceso corre en el servidor, fuera del contexto del navegador.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Límite de caracteres por documento, para no disparar el tamaño del prompt
// que se envía al modelo en cada respuesta del agente.
const MAX_CARACTERES = 8000

export async function POST(req: Request) {
  try {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ exito: false, error: 'No autenticado' }, { status: 401 })
    }

    const { agente_id, path, url, tipo_archivo } = await req.json()
    if (!agente_id || !path || !url) {
      return NextResponse.json({ exito: false, error: 'Faltan datos' }, { status: 400 })
    }

    // Verifica que quien llama sea realmente el dueño del agente.
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ exito: false, error: 'Sesión inválida' }, { status: 401 })
    }

    const { data: agenteRow } = await supabaseAdmin
      .from('agentes')
      .select('negocio_id')
      .eq('id', agente_id)
      .single()

    if (!agenteRow) {
      return NextResponse.json({ exito: false, error: 'Agente no encontrado' }, { status: 404 })
    }

    const { data: negocioRow } = await supabaseAdmin
      .from('negocios')
      .select('owner_id')
      .eq('id', agenteRow.negocio_id)
      .single()

    if (!negocioRow || negocioRow.owner_id !== userData.user.id) {
      return NextResponse.json({ exito: false, error: 'No autorizado' }, { status: 403 })
    }

    // Ubica el registro exacto en agente_documentos (ya creado por
    // agregar_documento_agente) para vincular el contenido al documento correcto.
    const { data: documentoRow } = await supabaseAdmin
      .from('agente_documentos')
      .select('id')
      .eq('agente_id', agente_id)
      .eq('url', url)
      .single()

    if (!documentoRow) {
      return NextResponse.json({ exito: false, error: 'No se encontró el registro del documento' }, { status: 404 })
    }

    const { data: archivo, error: dlError } = await supabaseAdmin.storage
      .from('documentos-agentes')
      .download(path)

    if (dlError || !archivo) {
      throw new Error('No se pudo descargar el documento: ' + dlError?.message)
    }

    const buffer = Buffer.from(await archivo.arrayBuffer())
    let contenido = ''

    if (tipo_archivo?.includes('pdf')) {
      const pdf = await getDocumentProxy(new Uint8Array(buffer))
      const { text } = await extractText(pdf, { mergePages: true })
      contenido = text
    } else if (tipo_archivo?.includes('word') || path.toLowerCase().endsWith('.docx')) {
      contenido = (await mammoth.extractRawText({ buffer })).value
    } else {
      contenido = buffer.toString('utf-8')
    }

    contenido = contenido.trim().slice(0, MAX_CARACTERES)

    if (!contenido) {
      return NextResponse.json({ exito: false, error: 'No se pudo extraer texto del documento' }, { status: 422 })
    }

    const { error: upsertError } = await supabaseAdmin
      .from('agente_documentos_contenido')
      .upsert({ documento_id: documentoRow.id, contenido }, { onConflict: 'documento_id' })

    if (upsertError) throw upsertError

    return NextResponse.json({ exito: true })
  } catch (err) {
    console.error('Error procesando documento:', err)
    return NextResponse.json(
      { exito: false, error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}