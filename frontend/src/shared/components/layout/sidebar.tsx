import { Link, useLocation } from 'react-router-dom'
import {
  MdDashboard,
  MdLanguage,
  MdWaterDrop,
  MdIntegrationInstructions,
  MdWarning,
  MdSpeed,
  MdNotifications,
  MdApi,
  MdSync,
  MdHistory,
  MdPeople,
  MdPersonAdd,
  MdSettings,
} from 'react-icons/md'
import { useAuthStore } from '@/app/store'
import { ROUTES } from '@/shared/constants/routes'
import { AUTH_ROLES } from '@/shared/constants/auth'
import { cn } from '@/shared/utils/cn'

interface NavItem {
  path: string
  label: string
  roles: string[]
  icon?: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  // Super Admin navigation
  { path: ROUTES.ADMIN, label: 'Dashboard', roles: [AUTH_ROLES.SUPER_ADMIN], icon: MdDashboard },
  {
    path: ROUTES.MANAGE_TENANTS,
    label: 'Manage Tenants',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdPeople,
  },
  {
    path: ROUTES.ADD_STATE_ADMIN,
    label: 'Add State Admin',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdPersonAdd,
  },
  {
    path: ROUTES.CONFIGURE_SYSTEM,
    label: 'Configure System',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdSettings,
  },

  // State Admin navigation
  {
    path: ROUTES.STATE_ADMIN_OVERVIEW,
    label: 'Overview',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdDashboard,
  },
  {
    path: ROUTES.STATE_ADMIN_LANGUAGE,
    label: 'Language',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdLanguage,
  },
  {
    path: ROUTES.STATE_ADMIN_WATER_NORMS,
    label: 'Water Norms',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdWaterDrop,
  },
  {
    path: ROUTES.STATE_ADMIN_INTEGRATION,
    label: 'Integration',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdIntegrationInstructions,
  },
  {
    path: ROUTES.STATE_ADMIN_ESCALATIONS,
    label: 'Escalations',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdWarning,
  },
  {
    path: ROUTES.STATE_ADMIN_THRESHOLDS,
    label: 'Thresholds',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdSpeed,
  },
  {
    path: ROUTES.STATE_ADMIN_NUDGES,
    label: 'Nudges Template',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdNotifications,
  },
  {
    path: ROUTES.STATE_ADMIN_API_INGESTION,
    label: 'API Ingestion',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdApi,
  },
  {
    path: ROUTES.STATE_ADMIN_OPERATOR_SYNC,
    label: 'Operator Sync',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdSync,
  },
  {
    path: ROUTES.STATE_ADMIN_ACTIVITY,
    label: 'Activity',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdHistory,
  },
  {
    path: ROUTES.STATE_ADMIN_CONFIG,
    label: 'Configuration',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdSettings,
  },
]

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const userRole = user?.role
  const visibleNavItems = NAV_ITEMS.filter((item) => userRole && item.roles.includes(userRole))

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-white">
      {/* Brand Section */}
      <div className="flex h-20 items-center gap-2 border-b border-border px-6 pt-2">
        <MdWaterDrop className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold text-primary">JalSoochak</h1>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-6 py-4">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-background-secondary text-primary-dark'
                  : 'text-text-secondary hover:bg-background-tertiary'
              )}
            >
              {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile Section */}
      <div className="flex items-center gap-3 border-t border-border px-6 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <span className="text-sm font-semibold">{user ? getInitials(user.name) : 'U'}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-text-primary">
            {user?.name || 'User'}
          </span>
        </div>
      </div>
    </aside>
  )
}
