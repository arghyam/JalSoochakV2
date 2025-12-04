import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
