import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout } from '@/shared/components/layout/main-layout'
import { Dashboard } from '@/features/dashboard'
import { Schemes } from '@/features/schemes'
import { Readings } from '@/features/readings'
// import { Admin } from '@/features/admin/components/admin'
// import { StateAdmin } from '@/features/state-admin/components/state-admin'

export const router = createBrowserRouter([
  // {
  //   path: ROUTES.HOME,
  //   element: (
  //     <MainLayout>
  //       <Dashboard />
  //     </MainLayout>
  //   ),
  // },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
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
  // {
  //   path: ROUTES.ADMIN,
  //   element: (
  //     <MainLayout>
  //       <Admin />
  //     </MainLayout>
  //   ),
  // },
  // {
  //   path: ROUTES.STATE_ADMIN,
  //   element: (
  //     <MainLayout>
  //       <StateAdmin />
  //     </MainLayout>
  //   ),
  // },
])

