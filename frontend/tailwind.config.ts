import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    transparent: 'transparent',
    current: 'currentColor',
    extend: {
      colors: {
        // Tremor Theme Colors
        tremor: {
          brand: {
            faint: '#EFF6FF', // brand-primary-50
            muted: '#BFDBFE', // brand-primary-200
            subtle: '#60A5FA', // brand-primary-400
            DEFAULT: '#2563EB', // brand-primary-600
            emphasis: '#1D4ED8', // brand-primary-700
            inverted: '#FFFFFF', // white
          },
          background: {
            muted: '#F9FAFB', // gray-50
            subtle: '#F3F4F6', // gray-100
            DEFAULT: '#FFFFFF', // white
            emphasis: '#F9FAFB', // gray-50
          },
          border: {
            DEFAULT: '#E5E7EB', // gray-200
          },
          ring: {
            DEFAULT: '#2563EB', // brand-primary-600
          },
          content: {
            subtle: '#9CA3AF', // gray-400
            DEFAULT: '#6B7280', // gray-500
            emphasis: '#111827', // gray-900
            strong: '#111827', // gray-900
            inverted: '#FFFFFF', // white
          },
        },

        // Brand Colors
        brand: {
          primary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
            DEFAULT: '#2563EB',
          },
          secondary: {
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
            500: '#0EA5E9',
            600: '#0284C7',
            700: '#0369A1',
            800: '#075985',
            900: '#0C4A6E',
            DEFAULT: '#0EA5E9',
          },
        },

        // Semantic Colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          DEFAULT: '#22C55E',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          DEFAULT: '#F59E0B',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          DEFAULT: '#EF4444',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          DEFAULT: '#3B82F6',
        },
      },

      // Typography
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },

      // Border Radius
      borderRadius: {
        'brand-sm': '0.125rem',
        'brand-base': '0.25rem',
        'brand-md': '0.375rem',
        'brand-lg': '0.5rem',
        'brand-xl': '0.75rem',
        'brand-2xl': '1rem',
        'brand-3xl': '1.5rem',
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
      },

      // Box Shadows
      boxShadow: {
        'brand-sm': '0 1px 2px 0 rgba(37, 99, 235, 0.1)',
        'brand-md': '0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -2px rgba(37, 99, 235, 0.1)',
        'brand-lg':
          '0 10px 15px -3px rgba(37, 99, 235, 0.15), 0 4px 6px -4px rgba(37, 99, 235, 0.1)',
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [tailwindcssAnimate],
}

export default config
