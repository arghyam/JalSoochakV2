import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout } from '@/shared/components/layout/main-layout'
import { CentralDashboard } from '@/features/dashboard/components/central-dashboard'
import { Schemes } from '@/features/schemes'
import { Readings } from '@/features/readings'
import { Admin } from '@/features/admin/components/admin'
import { StateAdmin } from '@/features/state-admin/components/state-admin'

export const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: (
      <MainLayout>
        <CentralDashboard />
      </MainLayout>
    ),
  },
  // Dashboard drilldown routes
  {
    path: '/states/:stateId',
    element: (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">State Dashboard</h1>
          <p className="text-muted-foreground">State dashboard coming soon...</p>
        </div>
      </MainLayout>
    ),
  },
  {
    path: '/zones/:zoneId',
    element: (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Zone Dashboard</h1>
          <p className="text-muted-foreground">Zone dashboard coming soon...</p>
        </div>
      </MainLayout>
    ),
  },
  // Other routes
  {
    path: ROUTES.SCHEMES,
    element: (
      <MainLayout>
        <Schemes />
      </MainLayout>
    ),
  },
  {
    path: ROUTES.READINGS,
    element: (
      <MainLayout>
        <Readings />
      </MainLayout>
    ),
  },
  // Protected routes
  {
    path: ROUTES.ADMIN,
    element: (
      <MainLayout>
        <Admin />
      </MainLayout>
    ),
  },
  {
    path: ROUTES.STATE_ADMIN,
    element: (
      <MainLayout>
        <StateAdmin />
      </MainLayout>
    ),
  },
])
