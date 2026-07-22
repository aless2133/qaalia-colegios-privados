'use client'

import { motion } from 'framer-motion'
import { Brush2, BrushBig } from 'iconsax-react'
import type { EditPagePerfil } from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

// PALETA ESCALABLE
export const BRAND_COLORS: { hex: string; name: string }[] = [
  // Azules
  { hex: '#818CF8', name: 'Periwinkle'      },
  { hex: '#6366F1', name: 'Índigo'          },
  { hex: '#3B82F6', name: 'Azul Royal'      },
  { hex: '#1D9BF0', name: 'Azul'            },
  { hex: '#0EA5E9', name: 'Celeste'         },
  // Cian & Teal
  { hex: '#22D3EE', name: 'Cian Claro'      },
  { hex: '#06B6D4', name: 'Cian'            },
  { hex: '#2DD4BF', name: 'Turquesa'        },
  { hex: '#14B8A6', name: 'Verde Azulado'   },
  // Verdes
  { hex: '#4ADE80', name: 'Verde Claro'     },
  { hex: '#22C55E', name: 'Verde'           },
  { hex: '#10B981', name: 'Esmeralda'       },
  { hex: '#84CC16', name: 'Lima'            },
  // Amarillos
  { hex: '#FBBF24', name: 'Amarillo'        },
  { hex: '#F59E0B', name: 'Ámbar'           },
  { hex: '#EAB308', name: 'Dorado'          },
  // Naranjas
  { hex: '#FB923C', name: 'Durazno'         },
  { hex: '#F97316', name: 'Naranja'         },
  { hex: '#EA580C', name: 'Naranja Intenso' },
  // Rojos
  { hex: '#F87171', name: 'Rojo Suave'      },
  { hex: '#EF4444', name: 'Rojo'            },
  { hex: '#DC2626', name: 'Rojo Intenso'    },
  // Rosas
  { hex: '#FB7185', name: 'Rosa Coral'      },
  { hex: '#F472B6', name: 'Rosa Claro'      },
  { hex: '#EC4899', name: 'Rosa'            },
  { hex: '#F43F5E', name: 'Rosa Frambuesa'  },
  { hex: '#FF4DA6', name: 'Rosa Mexicano'   },
  // Púrpuras & Magenta
  { hex: '#C084FC', name: 'Lila'            },
  { hex: '#A855F7', name: 'Púrpura'         },
  { hex: '#8B5CF6', name: 'Violeta'         },
  { hex: '#7C3AED', name: 'V. Profundo'     },
  { hex: '#D946EF', name: 'Magenta'         },
  { hex: '#E879F9', name: 'Fucsia'          },
  // Especiales
  { hex: '#FF6B6B', name: 'Coral'           },
  { hex: '#00B4D8', name: 'Azul Petróleo'   },
]

interface ColorsBrandingProps {
  perfil:    EditPagePerfil
  setPerfil: (fn: (prev: EditPagePerfil) => EditPagePerfil) => void
}

export default function ColorsBranding({ perfil, setPerfil }: ColorsBrandingProps) {
  const selected = perfil.color_marca || '#7C3AED'
  const label    = BRAND_COLORS.find(c => c.hex === selected)?.name ?? 'Personalizado'

  return (
    <div>
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <BrushBig size={16} color="currentColor" className="text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">Color de la pagina</p>
      </div>

      <div className="mx-4 mb-3 rounded-2xl px-4 py-3 flex items-center gap-3 bg-accent/60">
        {/* Swatch seleccionado */}
        <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: selected }} />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate text-foreground">{label}</p>
          <p className="text-[10px] font-mono tracking-wide text-muted-foreground">{selected}</p>
        </div>

        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ background: selected + '30' }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: selected }} />
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-wrap gap-[10px]">
        {BRAND_COLORS.map(({ hex, name }) => {
          const active = selected === hex
          return (
            <motion.button
              key={hex}
              title={name}
              whileTap={{ scale: 0.85 }}
              onClick={() => setPerfil(prev => ({ ...prev, color_marca: hex }))}
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width:         36,
                height:        36,
                borderRadius:  999,
                background:    hex,
                outline:       active ? `3px solid ${hex}` : '3px solid transparent',
                outlineOffset: 2,
              }}
            >
              {active && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.14 }}
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M2.5 7.5L5.5 10.5L12.5 4.5"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}