export * from './colors'
export * from './typography'
export * from './spacing'
export * from './shadows'
export * from './borders'

import { colors } from './colors'
import { typography } from './typography'
import { spacing, semanticSpacing } from './spacing'
import { shadows, semanticShadows } from './shadows'
import { borders, semanticBorders } from './borders'

export const tokens = {
  colors,
  typography,
  spacing,
  semanticSpacing,
  shadows,
  semanticShadows,
  borders,
  semanticBorders,
} as const

export type DesignTokens = typeof tokens
