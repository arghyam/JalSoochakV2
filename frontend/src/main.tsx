import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/globals.css'
import App from './App.tsx'
import indiaGeoJsonRaw from '@/assets/data/geojson/india.geojson?raw'
import { isIndiaMapRegistered, registerIndiaMap } from '@/features/dashboard/utils/map-registry'

if (!isIndiaMapRegistered()) {
  const indiaGeoJson = JSON.parse(indiaGeoJsonRaw) as unknown
  registerIndiaMap(indiaGeoJson)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
