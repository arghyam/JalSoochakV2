import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

export function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600">Session Expired</h1>
        <p className="mt-3 text-sm text-gray-600">
          Your session has expired for security reasons. Please sign in again to continue using
          JalSoochak.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}
