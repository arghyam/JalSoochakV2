export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  width: {
    0: '0',
    DEFAULT: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
} as const

export const semanticBorders = {
  input: {
    radius: borders.radius.md,
    width: borders.width.DEFAULT,
  },
  button: {
    radius: borders.radius.md,
    width: borders.width.DEFAULT,
  },
  card: {
    radius: borders.radius.lg,
    width: borders.width.DEFAULT,
  },
  modal: {
    radius: borders.radius.xl,
    width: borders.width[0],
  },
  badge: {
    radius: borders.radius.full,
    width: borders.width[0],
  },
} as const

export type BorderRadiusKey = keyof typeof borders.radius
export type BorderWidthKey = keyof typeof borders.width
