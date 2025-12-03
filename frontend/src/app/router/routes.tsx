import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout, DashboardLayout } from '@/shared/components/layout'
import { CentralDashboard } from '@/features/dashboard/components/central-dashboard'
import { Admin } from '@/features/admin/components/admin'
import { StateAdmin } from '@/features/state-admin/components/state-admin'
import { LoginPage } from '@/features/auth'
import { ProtectedRoute, RedirectIfAuthenticated } from '@/shared/components/routing/ProtectedRoute'
import { AUTH_ROLES } from '@/shared/constants/auth'

export const router = createBrowserRouter([
  // Public dashboards
  {
    path: ROUTES.DASHBOARD,
    element: (
      <DashboardLayout>
        <CentralDashboard />
      </DashboardLayout>
    ),
  },
  {
    path: '/states/:stateId',
    element: (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">State Dashboard</h1>
          <p className="text-muted-foreground">State dashboard coming soon...</p>
        </div>
      </DashboardLayout>
    ),
  },
  {
    path: '/zones/:zoneId',
    element: (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Zone Dashboard</h1>
          <p className="text-muted-foreground">Zone dashboard coming soon...</p>
        </div>
      </DashboardLayout>
    ),
  },
  // Auth
  {
    path: ROUTES.LOGIN,
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  // Protected routes
  {
    path: ROUTES.ADMIN,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_USER]}>
        <MainLayout>
          <Admin />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.STATE_ADMIN,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.STATE_ADMIN]}>
        <MainLayout>
          <StateAdmin />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
])
