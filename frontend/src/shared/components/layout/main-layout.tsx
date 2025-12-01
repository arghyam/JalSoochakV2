import type { ReactNode } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { useUIStore } from '@/app/store'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

