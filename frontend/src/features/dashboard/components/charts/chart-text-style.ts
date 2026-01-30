type ThemeLike = {
  textStyles?: {
    bodyText7?: {
      fontSize?: string | number
      lineHeight?: string | number
      color?: string
    }
  }
  colors?: Record<string, Record<string, string>>
}

const toNumber = (value: string | number | undefined, fallback: number) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

export const getBodyText7Style = (theme: ThemeLike | undefined | unknown) => {
  const safeTheme = theme as ThemeLike | undefined
  const style = safeTheme?.textStyles?.bodyText7 ?? {}
  const colorToken = style.color
  let color = colorToken

  if (colorToken?.includes('.')) {
    const [scale, shade] = colorToken.split('.')
    color = safeTheme?.colors?.[scale]?.[shade] ?? colorToken
  }

  return {
    fontSize: toNumber(style.fontSize, 12),
    lineHeight: toNumber(style.lineHeight, 16),
    fontWeight: 400 as const,
    color,
  }
}
