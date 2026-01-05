// Base color definitions
const brandColors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main blue
    600: '#2563EB', // Darker blue for emphasis
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Light blue
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
} as const

const neutralColors = {
  white: '#FFFFFF',
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  black: '#000000',
} as const

const semanticBaseColors = {
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E', // Green for success states
    600: '#16A34A',
    700: '#15803D',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B', // Amber for warnings
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444', // Red for errors
    600: '#DC2626',
    700: '#B91C1C',
  },
} as const

// Export main colors object with DRY references
export const colors = {
  brand: brandColors,

  neutral: neutralColors,

  semantic: {
    ...semanticBaseColors,
    // Reference brand.primary instead of duplicating
    info: brandColors.primary,
  },

  ui: {
    background: {
      primary: neutralColors.white,
      secondary: neutralColors[50],
      tertiary: neutralColors[100],
    },
    text: {
      primary: neutralColors[900],
      secondary: neutralColors[500],
      tertiary: neutralColors[400],
      inverse: neutralColors.white,
      link: brandColors.primary[600],
    },
    border: {
      light: neutralColors[200],
      medium: neutralColors[300],
      dark: neutralColors[400],
    },
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  charts: {
    blue: brandColors.primary[500],
    indigo: '#6366F1',
    purple: '#8B5CF6',
    pink: '#EC4899',
    rose: '#F43F5E',
    orange: '#F97316',
    amber: semanticBaseColors.warning[500],
    yellow: '#EAB308',
    lime: '#84CC16',
    green: semanticBaseColors.success[500],
    emerald: '#10B981',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    sky: brandColors.secondary[500],
  },
} as const

export const { brand, neutral, semantic, ui, charts } = colors

export type BrandColor = keyof typeof colors.brand
export type NeutralColor = keyof typeof colors.neutral
export type SemanticColor = keyof typeof colors.semantic
export type ChartColor = keyof typeof colors.charts
