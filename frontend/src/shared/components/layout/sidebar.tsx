import { Link, useLocation } from 'react-router-dom'
import { useUIStore, useAuthStore } from '@/app/store'
import { ROUTES } from '@/shared/constants/routes'
import { AUTH_ROLES } from '@/shared/constants/auth'
import { cn } from '@/shared/utils/cn'

interface NavItem {
  path: string
  label: string
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  // Super Admin navigation
  { path: ROUTES.ADMIN, label: 'Dashboard', roles: [AUTH_ROLES.SUPER_ADMIN] },
  { path: ROUTES.MANAGE_TENANTS, label: 'Manage Tenants', roles: [AUTH_ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADD_STATE_ADMIN, label: 'Add State Admin', roles: [AUTH_ROLES.SUPER_ADMIN] },
  { path: ROUTES.CONFIGURE_SYSTEM, label: 'Configure System', roles: [AUTH_ROLES.SUPER_ADMIN] },

  // State Admin navigation
  { path: ROUTES.STATE_ADMIN, label: 'Dashboard', roles: [AUTH_ROLES.STATE_ADMIN] },
  { path: ROUTES.STATE_ADMIN_CONFIG, label: 'Configuration', roles: [AUTH_ROLES.STATE_ADMIN] },
]

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!sidebarOpen) return null

  const userRole = user?.role
  const visibleNavItems = NAV_ITEMS.filter((item) => userRole && item.roles.includes(userRole))

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r bg-white shadow-lg">
      <nav className="mt-16 space-y-1 p-4">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
