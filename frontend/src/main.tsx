import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.tsx'
import indiaGeoJsonRaw from '@/assets/data/geojson/india.geojson?raw'
import { isIndiaMapRegistered, registerIndiaMap } from '@/features/dashboard/utils/map-registry'

const theme = extendTheme({})

if (!isIndiaMapRegistered()) {
  const indiaGeoJson = JSON.parse(indiaGeoJsonRaw) as unknown
  registerIndiaMap(indiaGeoJson)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
)
