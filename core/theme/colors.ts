/**
 * Qaalia – Referencias de Design Tokens en JS
 *
 * La fuente de verdad está en app/globals.css.
 * Usa clases Tailwind (bg-primary, text-muted-foreground) siempre que puedas.
 * Usa este objeto solo cuando necesites estilos inline (canvas, SVG, librerías
 * de charts, etc.) — NUNCA pongas hex directamente en los componentes.
 */
export const colors = {
  background:          'var(--background)',
  foreground:          'var(--foreground)',
  card:                'var(--card)',
  cardForeground:      'var(--card-foreground)',
  primary:             'var(--primary)',
  primaryForeground:   'var(--primary-foreground)',
  secondary:           'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted:               'var(--muted)',
  mutedForeground:     'var(--muted-foreground)',
  accent:              'var(--accent)',
  accentForeground:    'var(--accent-foreground)',
  destructive:         'var(--destructive)',
  border:              'var(--border)',
  input:               'var(--input)',
  ring:                'var(--ring)',
  success:             'var(--success)',
  warning:             'var(--warning)',
  error:               'var(--error)',
  info:                'var(--info)',
} as const

export type ColorKey = keyof typeof colors