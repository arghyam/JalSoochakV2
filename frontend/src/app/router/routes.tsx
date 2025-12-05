import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout, DashboardLayout } from '@/shared/components/layout'
import { CentralDashboard } from '@/features/dashboard/components/central-dashboard'
import { Admin, ManageTenants, StateAdminManagement, ConfigureSystem } from '@/features/admin'
import { StateAdminDashboard, StateAdminConfiguration } from '@/features/state-admin'
import { LoginPage } from '@/features/auth'
// import { ProtectedRoute } from '@/shared/components/routing/ProtectedRoute'
import { RedirectIfAuthenticated } from '@/shared/components/routing/ProtectedRoute'
// import { AUTH_ROLES } from '@/shared/constants/auth'
import { NotFoundPage } from '@/shared/components/common'

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
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_USER]}>
      <MainLayout>
        <Admin />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADD_STATE_ADMIN,
    element: (
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_USER]}>
      <MainLayout>
        <StateAdminManagement />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CONFIGURE_SYSTEM,
    element: (
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_USER]}>
      <MainLayout>
        <ConfigureSystem />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_TENANTS,
    element: (
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_USER]}>
      <MainLayout>
        <ManageTenants />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.STATE_ADMIN,
    element: (
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.STATE_ADMIN]}>
      <MainLayout>
        <StateAdminDashboard />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.STATE_ADMIN_CONFIG,
    element: (
      // <ProtectedRoute allowedRoles={[AUTH_ROLES.STATE_ADMIN]}>
      <MainLayout>
        <StateAdminConfiguration />
      </MainLayout>
      // </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
