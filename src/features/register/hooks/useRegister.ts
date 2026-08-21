'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { useGoogleAuth } from '@/src/lib/auth/UseLogic'

export type RegisterStep = 'google' | 'step1' | 'step2' | 'success'

interface Form {
  nombre:       string
  telefono:     string
  nombre_dueno: string
}

const INITIAL_FORM: Form = {
  nombre: '', telefono: '', nombre_dueno: '',
}

export function useRegister() {
  const router   = useRouter()
  const supabase = createClient()
  const { loginWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth()
  const [step,    setStep]    = useState<RegisterStep>('google')
  const [form,    setForm]    = useState<Form>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [user, setUser] = useState<any>(null)

  const initUser = async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) return
    
    const { data: negociosData } = await supabase.rpc('obtener_mis_negocios', { p_owner_id: u.id })
    const params = new URLSearchParams(window.location.search)
    const esNuevoNegocio = params.get('nuevo') === 'true'
    
    if (negociosData?.total > 0 && !esNuevoNegocio) {
      router.replace('/dashboard')
      return
    }
    
    setUser(u)
    const nombre = u.user_metadata?.full_name || u.user_metadata?.name || ''
    setForm(prev => ({
      ...prev,
      nombre_dueno: nombre,
    }))
    setStep('step1')
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()

      setTimeout(async () => {
        await initUser()
      }, 1500)
    } catch (e) {
      console.error('Error en login:', e)
    }
  }

 useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const esNuevoNegocio = params.get('nuevo') === 'true'

  supabase.auth.getUser().then(async ({ data: { user: u } }) => {
    if (!u) return 

    const { data: negociosData } = await supabase.rpc('obtener_mis_negocios', { p_owner_id: u.id })
    const tieneNegocios = (negociosData?.total ?? 0) > 0

    if (tieneNegocios && !esNuevoNegocio) {
      return
    }

    setUser(u)
    const nombre = u.user_metadata?.full_name || u.user_metadata?.name || ''
    setForm(prev => ({ ...prev, nombre_dueno: nombre }))
    setStep('step1')
  })
}, [])

  const handleStep1 = () => {
    if (!form.nombre.trim())  { setError('Ingresa el nombre del negocio'); return }
    setError('')
    setStep('step2')
  }

  const handleSubmit = async () => {
    if (!form.telefono.trim())     { setError('Ingresa el teléfono'); return }
    if (!form.nombre_dueno.trim()) { setError('Ingresa tu nombre'); return }
    if (!user)                     { setError('Sesión expirada, vuelve a iniciar sesión'); return }

    setLoading(true)
    setError('')
    try {
      const { data, error: rpcErr } = await supabase.rpc('crear_negocio', {
        p_owner_id:     user.id,
        p_nombre:       form.nombre,
        p_telefono:     form.telefono,
        p_correo:       user.email,
        p_nombre_dueno: form.nombre_dueno,
        p_foto_dueno:   user.user_metadata?.avatar_url || null,
      })

      if (rpcErr || !data?.exito) {
        setError(data?.error || 'Error al crear el negocio')
        return
      }
      await supabase.auth.updateUser({ data: { afull_role: 'negocio' } })
      setStep('success')
    } catch (e: any) {
      setError(e.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const irAlPanel = () => router.replace('/dashboard')

  return {
    step, setStep,
    form, setForm,
    user,
    loading: loading || googleLoading,
    error:   error || googleError,
    setError,
    loginWithGoogle: handleGoogleLogin,
    initUser,
    handleStep1,
    handleSubmit,
    irAlPanel,
  }
}