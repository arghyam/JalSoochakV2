import { Link, useLocation } from 'react-router-dom'
import { useUIStore } from '@/app/store'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/utils/cn'

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const location = useLocation()

  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.SCHEMES, label: 'Schemes' },
    { path: ROUTES.READINGS, label: 'Readings' },
    // { path: ROUTES.ADMIN, label: 'Admin' },
    // { path: ROUTES.STATE_ADMIN, label: 'State Admin' },
  ]

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-lg">
      <nav className="mt-16 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
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

