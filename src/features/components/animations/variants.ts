import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const stagger = (delay = 0.1): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay } },
})

export const cardHover = {
  rest:  { y: 0,  boxShadow: '0 0 0 0 rgba(29,204,184,0)' },
  hover: {
    y: -4,
    boxShadow: '0 16px 40px -8px rgba(29,204,184,0.18)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

// ── FIX: initial añadido para evitar conflicto con parent variants ────────────
export const glowPulse = {
  initial: { opacity: 0.4, scale: 1 },
  animate: {
    opacity: [0.4, 0.72, 0.4],
    scale:   [1, 1.06, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const badgeFloat = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}