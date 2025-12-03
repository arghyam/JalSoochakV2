import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/query-provider'
import { ErrorBoundary } from '@/shared/components/common/error-boundary'
import { router } from '@/app/router'
import { useAuthStore } from '@/app/store'

function App() {
  const restoreFromToken = useAuthStore((state) => state.restoreFromToken)

  useEffect(() => {
    restoreFromToken()
  }, [restoreFromToken])

  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
