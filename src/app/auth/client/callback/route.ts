import { createClient } from '@/src/lib/supabase/server'
import { NextResponse }  from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/client/auth`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/client/auth`)
  }

  const user = data.user
  const meta = user.user_metadata

  const { data: result } = await supabase.rpc('crear_cuenta_usuario', {
    p_user_id:         user.id,
    p_nombre_completo: meta.full_name || meta.name || user.email!,
    p_correo:          user.email!,
    p_foto_perfil:     meta.avatar_url || meta.picture || null,
  })

  if (result?.es_negocio) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/client?error=negocio`)
  }

  return NextResponse.redirect(`${origin}/start`)
}