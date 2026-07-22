'use client'

import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import Navbar from '@/src/features/(agent)/agent/components/layouts/shared/Navbar'

interface Props {
  slug: string
  children: React.ReactNode
  onNuevoChat?: () => void
}

export default function AgentBrandLayout({ slug, children, onNuevoChat }: Props) {
  const agent = useAgent(slug)

  const colorMarca = agent.negocio?.branding?.color_marca || '#7C3AED'
  const fontFamily = agent.negocio?.branding?.font_family || 'var(--font-sans)'

  return (
    <div
      data-agent-root
      style={{
        '--brand-color': colorMarca,
        '--primary': 'oklch(from var(--brand-color) l c h)',
        fontFamily,
      } as React.CSSProperties}
      className="min-h-screen flex flex-col"
    >
      {/* Inyección CSS Global para Portales (Sheet, Modales) y herencia de fuentes */}
      <style>{`
        :root, [data-agent-root] {
          --brand-color: ${colorMarca} !important;
          --primary: oklch(from var(--brand-color) l c h) !important;
        }
        [data-agent-root], 
        [data-radix-portal], 
        [role="dialog"], 
        button, 
        input, 
        textarea, 
        select {
          font-family: ${fontFamily}, var(--font-sans), sans-serif !important;
        }
      `}</style>

      <Navbar
        nombreNegocio={agent.negocio?.nombre ?? ''}
        loading={agent.loading}
        onNuevoChat={onNuevoChat}
      />

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}