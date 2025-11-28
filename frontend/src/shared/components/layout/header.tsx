import { useUIStore } from '@/app/store'

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="flex h-16 items-center border-b bg-white px-6 shadow-sm">
      <button
        onClick={toggleSidebar}
        className="mr-4 rounded p-2 hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl font-semibold">JalSoochak V2</h1>
    </header>
  )
}

