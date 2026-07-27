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
  // tipografia_catalogo.font_family siempre llega como stack CSS completo
  // (ej. "Varela Round, sans-serif"), ya validado por el catálogo — se usa tal cual.
  const cssFontFamily = agent.negocio?.branding?.font_family || 'var(--font-sans), sans-serif'

  return (
    <div
      data-agent-root
      style={{
        '--brand-color': colorMarca,
        '--primary': 'oklch(from var(--brand-color) l c h)',
        fontFamily: cssFontFamily,
      } as React.CSSProperties}
      className="min-h-screen flex flex-col"
    >
      {/* Inyección CSS Global para Portales (Sheet, Modales) y herencia de fuentes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
          font-family: ${cssFontFamily} !important;
        }
      `,
        }}
      />

      <Navbar
        nombreNegocio={agent.negocio?.nombre ?? ''}
        loading={agent.loading}
        onNuevoChat={onNuevoChat}
        nombreAgente={agent.nombreAgente}
        agentes={agent.agentes}
        agenteActivoId={agent.agenteActivoId}
        loadingAgente={agent.loading}
        onSeleccionarAgente={agent.seleccionarAgente}
      />

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}