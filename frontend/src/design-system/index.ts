export * from './tokens'

export * from './components'

import { colors, typography, spacing, shadows, borders } from './tokens'

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
} as const
