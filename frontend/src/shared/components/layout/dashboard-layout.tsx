import type { ReactNode } from 'react'
import { Header } from './header'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
