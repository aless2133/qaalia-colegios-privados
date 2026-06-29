import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES  = ['/', '/terms', '/privacy', '/home', '/team', '/client', '/auth/callback']
const RESERVE_PREFIX   = '/r/'
const AUTH_ROUTES    = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  if (pathname.startsWith(RESERVE_PREFIX)) return res

  // /team/dashboard requiere cookie dale_team_verified
  if (pathname.startsWith('/team/dashboard')) {
    const verified = req.cookies.get('dale_team_verified')
    if (!verified?.value) {
      return NextResponse.redirect(new URL('/team', req.url))
    }
  }

  if (PUBLIC_ROUTES.includes(pathname)) return res

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname === '/register') {
   return res 
 }

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', req.url))
    }
   // Cookie incluye el user.id — si cambia de usuario, no hay contaminación
const hasNegocioCookie = req.cookies.get('has_negocio')?.value === `1:${user.id}`
if (hasNegocioCookie) return res

const { data } = await supabase
  .rpc('obtener_mi_negocio', { p_owner_id: user.id })
if (!data?.tiene_negocio) {
  return NextResponse.redirect(new URL('/register', req.url))
}
res.cookies.set('has_negocio', `1:${user.id}`, {
  maxAge: 60 * 30,
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
})
return res
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|api).*)',
  ],
}