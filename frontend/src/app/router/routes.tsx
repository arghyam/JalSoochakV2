import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout, DashboardLayout } from '@/shared/components/layout'
import { CentralDashboard } from '@/features/dashboard/components/central-dashboard'
import { Admin, ManageTenants, StateAdminManagement, ConfigureSystem } from '@/features/admin'
import { StateAdminConfiguration, OverviewPage } from '@/features/state-admin'
import { LoginPage } from '@/features/auth'
import { ProtectedRoute, RedirectIfAuthenticated } from '@/shared/components/routing/ProtectedRoute'
import { AUTH_ROLES } from '@/shared/constants/auth'
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
      <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}>
        <MainLayout>
          <Admin />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADD_STATE_ADMIN,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}>
        <MainLayout>
          <StateAdminManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CONFIGURE_SYSTEM,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}>
        <MainLayout>
          <ConfigureSystem />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_TENANTS,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}>
        <MainLayout>
          <ManageTenants />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.STATE_ADMIN,
    element: (
      <ProtectedRoute allowedRoles={[AUTH_ROLES.STATE_ADMIN]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: ROUTES.STATE_ADMIN_LANGUAGE,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Language Configuration</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_WATER_NORMS,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Water Norms</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_INTEGRATION,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Integration</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_ESCALATIONS,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Escalations</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_THRESHOLDS,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Thresholds</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_NUDGES,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Nudges Template</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_API_INGESTION,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">API Ingestion</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_OPERATOR_SYNC,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Operator Sync</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_ACTIVITY,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Activity</h1>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_CONFIG,
        element: <StateAdminConfiguration />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
