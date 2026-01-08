import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { MainLayout, DashboardLayout } from '@/shared/components/layout'
import { CentralDashboard } from '@/features/dashboard/components/central-dashboard'
import { Admin, ManageTenants, StateAdminManagement, ConfigureSystem } from '@/features/admin'
import { OverviewPage, ActivityPage, LanguagePage } from '@/features/state-admin'
import { LoginPage } from '@/features/auth'
import { ProtectedRoute, RedirectIfAuthenticated } from '@/shared/components/routing/ProtectedRoute'
import { AUTH_ROLES } from '@/shared/constants/auth'
import { NotFoundPage } from '@/shared/components/common'

import { Box, Heading, Text } from '@chakra-ui/react'

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
        <Box p={6}>
          <Heading fontSize="2xl" fontWeight="bold">
            State Dashboard
          </Heading>
          <Text color="gray.600">State dashboard coming soon...</Text>
        </Box>
      </DashboardLayout>
    ),
  },
  {
    path: '/zones/:zoneId',
    element: (
      <DashboardLayout>
        <Box p={6}>
          <Heading fontSize="2xl" fontWeight="bold">
            Zone Dashboard
          </Heading>
          <Text color="gray.600">Zone dashboard coming soon...</Text>
        </Box>
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
        element: <LanguagePage />,
      },
      {
        path: ROUTES.STATE_ADMIN_WATER_NORMS,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Water Norms
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_INTEGRATION,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Integration
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_ESCALATIONS,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Escalations
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_THRESHOLDS,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Thresholds
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_NUDGES,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Nudges Template
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_API_INGESTION,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              API Ingestion
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_OPERATOR_SYNC,
        element: (
          <Box p={6}>
            <Heading fontSize="2xl" fontWeight="bold">
              Operator Sync
            </Heading>
            <Text color="gray.600">Coming soon...</Text>
          </Box>
        ),
      },
      {
        path: ROUTES.STATE_ADMIN_ACTIVITY,
        element: <ActivityPage />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])
