import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'

interface MainLayoutProps {
  children?: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="ml-56 flex-1 overflow-y-auto px-12 py-10">{children || <Outlet />}</main>
    </div>
  )
}
