import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  breakpoints: {
    sm: '30em', // 480px
    md: '48em', // 768px - tablet
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '90em', // 1440px - desktop
  },
  fonts: {
    heading: 'Geist, sans-serif',
    body: 'Geist, sans-serif',
  },
  colors: {
    // Primary Brand Color
    primary: {
      25: '#F5FAFF',
      50: '#EBF4FA',
      100: '#D6E9F5',
      200: '#ADD3EB',
      300: '#85BCE0',
      400: '#5CA6D6',
      500: '#3291D1', // Main brand color
      600: '#2874A7',
      700: '#1E577D',
      800: '#143954',
      900: '#0A1C2A',
      950: '#050E15',
    },
    // Secondary Color
    secondary: {
      25: '#FFFCF5',
      50: '#FFF9EB',
      100: '#FFF2D6',
      200: '#FFE5AD',
      300: '#FFD885',
      400: '#FFCB5C',
      500: '#FFA100', // Main secondary color
      600: '#CC8100',
      700: '#996100',
      800: '#664000',
      900: '#332000',
      950: '#1A1000',
    },
    // Neutral Colors
    neutral: {
      25: '#FAFAFA',
      50: '#F5F5F5',
      100: '#E4E4E7',
      200: '#D4D4D8',
      300: '#A1A1AA',
      400: '#71717A',
      500: '#52525B',
      600: '#3F3F46',
      700: '#27272A',
      800: '#1C1C1C',
      900: '#18181B',
      950: '#09090B',
    },
    // System Colors
    success: {
      50: '#ECFDF3',
      100: '#D1FADF',
      500: '#079455',
      600: '#067647',
      700: '#05603A',
    },
    warning: {
      50: '#FFFAEB',
      100: '#FEF0C7',
      500: '#F79009',
      600: '#DC6803',
      700: '#B54708',
    },
    error: {
      50: '#FEF3F2',
      100: '#FEE4E2',
      500: '#D92D20',
      600: '#B42318',
      700: '#912018',
    },
  },
  shadows: {
    default: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    active: '0px 0px 0px 4px rgba(50, 145, 209, 0.12)',
  },
  styles: {
    global: {
      body: {
        bg: 'neutral.25',
        color: 'neutral.800',
        fontSize: '16px',
        lineHeight: '24px',
        fontFamily: 'Geist, sans-serif',
      },
    },
  },
})

export default theme
